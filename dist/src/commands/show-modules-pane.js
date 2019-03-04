"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
// import { Service } from '../service';
const modules_pane_1 = require("../components/modules-pane");
const tree_view_dir_1 = require("../components/tree-view-dir");
async function showModulesPaneCommand() {
    try {
        // TODO: need to fix connection to right set token
        const api = await utils_1.getApi();
        // const user = 
        await utils_1.getUser();
        // const socket = getSocket();
        const modulesPane = new modules_pane_1.ModulesPane(api);
        new tree_view_dir_1.TreeViewDir(modulesPane);
    }
    catch (err) {
        //Noop.
    }
}
exports.showModulesPaneCommand = showModulesPaneCommand;
//# sourceMappingURL=show-modules-pane.js.map