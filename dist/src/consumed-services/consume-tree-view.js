"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const state_1 = require("../state");
const config_1 = require("../config");
const utils_1 = require("../utils");
// export function consumeTreeView(treeView: any) {
function consumeTreeView() {
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
    const srcDir = config_1.configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);
    const projectEntry = treeView.entryForPath(projectPath);
    projectEntry.addEventListener('click', async () => {
        await new Promise((resolve) => setTimeout(resolve));
        if (!projectEntry.classList.contains('expanded')) {
            return;
        }
        // Set screeps icon for screeps source folder.
        setDistIcon(treeView, fullPath);
        const { branch, modules } = state_1.default.getValue();
        if (!branch) {
            return;
        }
        const entry = treeView.entryForPath(fullPath);
        const modified = Object.values(modules).some(({ modified }) => !!modified);
        toggleEntryStatusModified(entry, modified);
        Object.entries(modules)
            .forEach(setTreeViewEntryStatus(treeView, branch));
    });
    // Set screeps icon for screeps source folder.
    setDistIcon(treeView, fullPath);
    // If user has modules values in global state
    const { branch, modules } = state_1.default.getValue();
    if (!modules || !branch) {
        return;
    }
    atom.commands.add(treeView.element, {
        'tree-view:expand-item': async function () {
            await new Promise((resolve) => setTimeout(resolve));
            // Set screeps icon for screeps source folder.
            setDistIcon(treeView, fullPath);
            const { branch, modules } = state_1.default.getValue();
            if (!branch) {
                return;
            }
            const entry = treeView.entryForPath(fullPath);
            const modified = Object.values(modules).some(({ modified }) => !!modified);
            toggleEntryStatusModified(entry, modified);
            Object.entries(modules)
                .forEach(setTreeViewEntryStatus(treeView, branch));
        }
    });
    const modules$ = state_1.default.pipe(operators_1.map(({ modules }) => modules))
        .pipe(operators_1.distinctUntilChanged());
    modules$
        .pipe(operators_1.switchMap((modules) => rxjs_1.from(Object.entries(modules))))
        .pipe(operators_1.tap(setTreeViewEntryStatus(treeView, branch)))
        .subscribe();
    modules$
        .pipe(operators_1.map((modules) => Object.entries(modules).some(([, { modified }]) => !!modified)))
        .pipe(operators_1.combineLatest(rxjs_1.of(treeView.entryForPath(fullPath))))
        .pipe(operators_1.tap(([modified, entry]) => toggleEntryStatusModified(entry, modified)))
        .subscribe();
}
exports.consumeTreeView = consumeTreeView;
function setDistIcon(treeView, fullPath) {
    const entry = treeView.entryForPath(fullPath);
    entry.setAttribute('screeps-dist', 'screeps-dist');
}
function setTreeViewEntryStatus(treeView, branch) {
    return ([name, { modified }]) => {
        const path = utils_1.getModulePath(branch, name);
        const entry = treeView.entryForPath(path);
        toggleEntryStatusModified(entry, modified);
    };
}
function toggleEntryStatusModified(entry, modified) {
    if (modified) {
        entry.classList.add('status-modified--screeps');
    }
    else {
        entry.classList.remove('status-modified--screeps');
    }
}
//# sourceMappingURL=consume-tree-view.js.map