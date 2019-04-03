"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const config_1 = require("../config");
function consumeTreeView(treeView) {
    const projectPath = atom.project.getPaths()[0];
    if (!projectPath) {
        return;
    }
    const srcDir = config_1.configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);
    const entry = treeView.entryForPath(fullPath);
    entry.setAttribute('screeps-dist', 'screeps-dist');
    console.log(entry);
}
exports.consumeTreeView = consumeTreeView;
//# sourceMappingURL=consume-tree-view.js.map