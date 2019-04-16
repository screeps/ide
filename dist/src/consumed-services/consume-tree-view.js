"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const state_1 = require("../state");
const config_1 = require("../config");
const utils_1 = require("../utils");
const commands_1 = require("../commands");
function consumeTreeView(treeView) {
    // Choose first project as screeps folder.
    const projectPath = atom.project.getPaths()[0];
    if (!projectPath) {
        // Return if project doesn't exist.
        return;
    }
    // Get local setting for screeps source folder.
    const srcDir = config_1.configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);
    // Set screeps icon for screeps source folder.
    const entry = treeView.entryForPath(fullPath);
    entry.setAttribute('screeps-dist', 'screeps-dist');
    // If user has modules values in global state
    const { branch, modules } = state_1.default.getValue();
    if (!modules || !branch) {
        return;
    }
    state_1.default.pipe(operators_1.map(({ modules }) => modules))
        .pipe(operators_1.distinctUntilChanged())
        .pipe(operators_1.switchMap(() => rxjs_1.from(Object.entries(modules))
        .pipe(operators_1.filter(([, { modified }]) => !!modified))))
        .pipe(operators_1.tap(([name, data]) => {
        const modulePath = utils_1.getModulePath(branch, name);
        commands_1.changeTreeViewItemStatus(modulePath, data);
    }))
        .toPromise();
}
exports.consumeTreeView = consumeTreeView;
//# sourceMappingURL=consume-tree-view.js.map