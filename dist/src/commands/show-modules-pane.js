"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// import { Service } from '../service';
const modules_pane_1 = require("../components/modules-pane");
const tree_view_dir_1 = require("../components/tree-view-dir");
async function showModulesPaneCommand() {
    try {
        const api = await utils_1.getApi();
        // const src = new Service();
        const modulesPane = new modules_pane_1.ModulesPane(api);
        new tree_view_dir_1.TreeViewDir(modulesPane);
    }
    catch (err) {
        //Noop.
    }
}
exports.showModulesPaneCommand = showModulesPaneCommand;
//# sourceMappingURL=show-modules-pane.js.map