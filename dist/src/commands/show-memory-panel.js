"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const service_1 = require("../service");
const memory_panel_1 = require("../components/memory-panel");
let memoryPanel;
async function showMemoryPanelCommand() {
    try {
        if (memoryPanel && memoryPanel.isVisible) {
            return;
        }
        atom.workspace.getBottomPanels().forEach((panel) => {
            panel.hide();
        });
        if (memoryPanel && !memoryPanel.isVisible) {
            memoryPanel.show();
            return;
        }
        const api = await utils_1.getApi();
        const user = await utils_1.getUser();
        const socket = utils_1.getSocket();
        memoryPanel = new memory_panel_1.MemoryPanel(user, api, socket, new service_1.Service());
    }
    catch (err) {
        // Ignore.
    }
}
exports.showMemoryPanelCommand = showMemoryPanelCommand;
//# sourceMappingURL=show-memory-panel.js.map