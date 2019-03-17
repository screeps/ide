"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const service_1 = require("../service");
const console_pane_1 = require("../components/console-pane");
let consolePanel;
async function showConsolePaneCommand() {
    try {
        if (consolePanel && consolePanel.isVisible) {
            return;
        }
        atom.workspace.getBottomPanels().forEach((panel) => {
            panel.hide();
        });
        if (consolePanel && !consolePanel.isVisible) {
            consolePanel.show();
            return;
        }
        const api = await utils_1.getApi();
        const user = await utils_1.getUser();
        const socket = utils_1.getSocket();
        consolePanel = new console_pane_1.ConsolePane(user, api, socket, new service_1.Service());
    }
    catch (err) {
        // Ignore.
    }
}
exports.showConsolePaneCommand = showConsolePaneCommand;
//# sourceMappingURL=show-console-pane.js.map