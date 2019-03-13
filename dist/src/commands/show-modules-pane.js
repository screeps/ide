"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
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
        const treeViewRef = new tree_view_dir_1.TreeViewDir(modulesPane);
        modulesPane.events$
            .pipe(operators_1.filter(({ type }) => type === modules_pane_1.ACTION_CLOSE))
            .pipe(operators_1.tap(() => {
            treeViewRef.destroy();
        }))
            .subscribe();
    }
    catch (err) {
        //Noop.
    }
}
exports.showModulesPaneCommand = showModulesPaneCommand;
//# sourceMappingURL=show-modules-pane.js.map