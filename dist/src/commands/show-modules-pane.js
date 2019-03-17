"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
const modules_pane_1 = require("../components/modules-pane");
const tree_view_dir_1 = require("../components/tree-view-dir");
async function showModulesPaneCommand() {
    try {
        const pane = atom.workspace.getPaneItems().find((pane) => {
            return pane instanceof modules_pane_1.ModulesPane;
        });
        if (pane) {
            return;
        }
        const api = await utils_1.getApi();
        await utils_1.getUser();
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