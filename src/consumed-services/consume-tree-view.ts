const path = require('path');

import { from, of } from 'rxjs';
import { tap, map, switchMap, distinctUntilChanged, combineLatest } from 'rxjs/operators';

import { default as __state } from '../state';
import { configGetter } from '../config';
import { getModulePath } from '../utils';

// export function consumeTreeView(treeView: any) {
export function consumeTreeView() {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    const treeView = treeViewPackage.mainModule.treeView;

    // Choose first project as screeps folder.
    const projectPath = atom.project.getPaths()[0];

    if (!projectPath) {
        // Return if project doesn't exist.
        return;
    }

    // Get local setting for screeps source folder.
    const srcDir = configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);

    const projectEntry = treeView.entryForPath(projectPath) as HTMLElement;
    projectEntry.addEventListener('click', async () => {
        await new Promise((resolve) => setTimeout(resolve));

        if (!projectEntry.classList.contains('expanded')) {
            return;
        }

        // Set screeps icon for screeps source folder.
        setDistIcon(treeView, fullPath);

        const { branch, modules } = __state.getValue();

        if (!branch) {
            return;
        }

        const entry = treeView.entryForPath(fullPath) as HTMLElement;

        const modified = Object.values(modules).some(({ modified }) => !!modified);
        toggleEntryStatusModified(entry, modified as boolean)

        Object.entries(modules)
            .forEach(setTreeViewEntryStatus(treeView, branch));
    });

    // Set screeps icon for screeps source folder.
    setDistIcon(treeView, fullPath);

    // If user has modules values in global state
    const { branch, modules } = __state.getValue();

    if (!modules || !branch) {
        return;
    }

    atom.commands.add(treeView.element, {
        'tree-view:expand-item': async function() {
            await new Promise((resolve) => setTimeout(resolve));

            // Set screeps icon for screeps source folder.
            setDistIcon(treeView, fullPath);

            const { branch, modules } = __state.getValue();

            if (!branch) {
                return;
            }

            const entry = treeView.entryForPath(fullPath) as HTMLElement;

            const modified = Object.values(modules).some(({ modified }) => !!modified);
            toggleEntryStatusModified(entry, modified as boolean)

            Object.entries(modules)
                .forEach(setTreeViewEntryStatus(treeView, branch));
        }
    });

    const modules$ = __state.pipe(map(({ modules }) => modules))
        .pipe(distinctUntilChanged());

    modules$
        .pipe(switchMap((modules) => from(Object.entries(modules))))
        .pipe(tap(setTreeViewEntryStatus(treeView, branch)))
        .subscribe();

    modules$
        .pipe(map((modules) => Object.entries(modules).some(([, { modified }]) => !!modified)))
        .pipe(combineLatest(of(treeView.entryForPath(fullPath) as HTMLElement)))
        .pipe(tap(([modified, entry]) => toggleEntryStatusModified(entry, modified as boolean)))
        .subscribe();

}

function setDistIcon(treeView: any, fullPath: string) {
    const entry = treeView.entryForPath(fullPath) as HTMLElement;
    entry.setAttribute('screeps-dist', 'screeps-dist');
}

function setTreeViewEntryStatus(treeView: any, branch: string) {
    return ([name, { modified }]: [string, IModule]) => {
        const path = getModulePath(branch, name);
        const entry = treeView.entryForPath(path) as HTMLElement;

        toggleEntryStatusModified(entry, modified as boolean);
    };
}

function toggleEntryStatusModified(entry: HTMLElement, modified: boolean) {
    if (modified) {
        entry.classList.add('status-modified--screeps');
    } else {
        entry.classList.remove('status-modified--screeps');
    }
}