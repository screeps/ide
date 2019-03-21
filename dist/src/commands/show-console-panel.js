"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
const service_1 = require("../service");
const console_panel_1 = require("../components/console-panel");
let consolePanel;
async function showConsolePanelCommand() {
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
        consolePanel = new console_panel_1.ConsolePanel(user, api, socket, new service_1.Service());
        consolePanel.events$
            .pipe(operators_1.filter(({ type }) => type === console_panel_1.ACTION_CLOSE))
            .pipe(operators_1.tap(() => {
            consolePanel = null;
        }))
            .subscribe();
    }
    catch (err) {
        // Ignore.
    }
}
exports.showConsolePanelCommand = showConsolePanelCommand;
//# sourceMappingURL=show-console-panel.js.map