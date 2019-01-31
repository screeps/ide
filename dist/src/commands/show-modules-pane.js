"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const service_1 = require("../service");
const modules_pane_1 = require("../components/modules-pane");
const tree_view_dir_1 = require("../components/tree-view-dir");
async function showModulesPaneCommand() {
    try {
        await utils_1.getApi();
        const src = new service_1.Service();
        new modules_pane_1.ModulesPane(src);
        new tree_view_dir_1.TreeViewDir(src);
    }
    catch (err) {
        //Noop.
    }
}
exports.showModulesPaneCommand = showModulesPaneCommand;
//# sourceMappingURL=show-modules-pane.js.map