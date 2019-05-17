"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
// import { from, of } from 'rxjs';
// import { tap, map, switchMap, distinctUntilChanged, combineLatest } from 'rxjs/operators';
// import { default as __state } from '../state';
const config_1 = require("../config");
// import { getModulePath } from '../utils';
const store_1 = require("../store");
const actions_1 = require("../components/screeps-panel/actions");
function consumeTreeView(treeView) {
    store_1.default.effect(async (state, { type }) => {
        if (![actions_1.ADD_PROJECT, 'UPDATE_ICON'].includes(type)) {
            return state;
        }
        const projectPath = atom.project.getPaths()[0];
        if (!projectPath) {
            // Return if project doesn't exist.
            return;
        }
        const srcDir = config_1.configGetter('src');
        const fullPath = path.resolve(projectPath, srcDir);
        await new Promise((resolve) => setTimeout(resolve));
        setDistIcon(treeView, fullPath);
    })
        .subscribe();
    store_1.default.dispatch({ type: 'UPDATE_ICON', payload: {} });
    atom.project.onDidChangePaths((paths) => {
        if (paths.length) {
            store_1.default.dispatch({ type: 'ADD_PROJECT', payload: {} });
            return;
        }
        store_1.default.dispatch({ type: 'REMOVE_PROJECT', payload: {} });
    });
    // const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // // @ts-ignore
    // const treeView = treeViewPackage.mainModule.treeView;
    // // Choose first project as screeps folder.
    // const projectPath = atom.project.getPaths()[0];
    // if (!projectPath) {
    //     // Return if project doesn't exist.
    //     return;
    // }
    // // Get local setting for screeps source folder.
    // const srcDir = configGetter('src');
    // const fullPath = path.resolve(projectPath, srcDir);
    // const projectEntry = treeView.entryForPath(projectPath) as HTMLElement;
    // projectEntry.addEventListener('click', treeViewExpandItem);
    // atom.commands.add(treeView.element, {
    //     'tree-view:expand-item': treeViewExpandItem
    // });
    // // Set screeps icon for screeps source folder.
    // setDistIcon(treeView, fullPath);
    // // If user has modules values in global state
    // const { branch, modules } = __state.getValue();
    // if (!modules || !branch) {
    //     return;
    // }
    // async function treeViewExpandItem() {
    //     await new Promise((resolve) => setTimeout(resolve));
    //     if (!projectEntry.classList.contains('expanded')) {
    //         return;
    //     }
    //     // Set screeps icon for screeps source folder.
    //     setDistIcon(treeView, fullPath);
    //     const { branch, modules } = __state.getValue();
    //     if (!modules || !branch) {
    //         return;
    //     }
    //     const entry = treeView.entryForPath(fullPath) as HTMLElement;
    //     const modified = Object.values(modules).some(({ modified }) => !!modified);
    //     toggleEntryStatusModified(entry, modified as boolean)
    //     Object.entries(modules)
    //         .forEach(setTreeViewEntryStatus(treeView, branch));
    // }
    // const modules$ = __state.pipe(map(({ modules }) => modules))
    //     .pipe(distinctUntilChanged());
    // modules$
    //     .pipe(switchMap((modules) => from(Object.entries(modules))))
    //     .pipe(tap(setTreeViewEntryStatus(treeView, branch)))
    //     .subscribe();
    // modules$
    //     .pipe(map((modules) => Object.entries(modules).some(([, { modified }]) => !!modified)))
    //     .pipe(combineLatest(of(treeView.entryForPath(fullPath) as HTMLElement)))
    //     .pipe(tap(([modified, entry]) => toggleEntryStatusModified(entry, modified as boolean)))
    //     .subscribe();
}
exports.consumeTreeView = consumeTreeView;
function setDistIcon(treeView, fullPath) {
    const entry = treeView.entryForPath(fullPath);
    entry.setAttribute('screeps-dist', 'screeps-dist');
}
// function setTreeViewEntryStatus(treeView: any, branch: string) {
//     return ([name, { modified }]: [string, IModule]) => {
//         const path = getModulePath(branch, name);
//         const entry = treeView.entryForPath(path) as HTMLElement;
//         toggleEntryStatusModified(entry, modified as boolean);
//     };
// }
// function toggleEntryStatusModified(entry: HTMLElement, modified: boolean) {
//     if (modified) {
//         entry.classList.add('status-modified--screeps');
//     } else {
//         entry.classList.remove('status-modified--screeps');
//     }
// }
//# sourceMappingURL=consume-tree-view.js.map