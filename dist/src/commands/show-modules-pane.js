"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const modules_pane_1 = require("../components/modules-pane");
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
        new modules_pane_1.ModulesPane(api);
    }
    catch (err) {
        //Noop.
    }
}
exports.showModulesPaneCommand = showModulesPaneCommand;
//# sourceMappingURL=show-modules-pane.js.map