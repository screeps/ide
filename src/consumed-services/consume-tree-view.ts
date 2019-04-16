const path = require('path');

import { from } from 'rxjs';
import { tap, map, switchMap, filter, distinctUntilChanged } from 'rxjs/operators';

import { default as __state } from '../state';
import { configGetter } from '../config';
import { getModulePath } from '../utils';

import { changeTreeViewItemStatus } from '../commands';

export function consumeTreeView(treeView: any) {
    // Choose first project as screeps folder.
    const projectPath = atom.project.getPaths()[0];

    if (!projectPath) {
        // Return if project doesn't exist.
        return;
    }

    // Get local setting for screeps source folder.
    const srcDir = configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);

    // Set screeps icon for screeps source folder.
    const entry = treeView.entryForPath(fullPath) as HTMLElement;
    entry.setAttribute('screeps-dist', 'screeps-dist');

    // If user has modules values in global state
    const { branch, modules } = __state.getValue();

    if (!modules || !branch) {
        return;
    }

    __state.pipe(map(({ modules }) => modules))
        .pipe(distinctUntilChanged())
        .pipe(switchMap(() => 
            from(Object.entries(modules))
                .pipe(filter(([, { modified }]) => !!modified))
        ))
        .pipe(tap(([name, data]) => {
            const modulePath = getModulePath(branch, name);
            changeTreeViewItemStatus(modulePath, data);
        }))
        .toPromise();

}
