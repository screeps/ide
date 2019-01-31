"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const service_1 = require("../service");
const memory_pane_1 = require("../components/memory-pane");
async function showMemoryPaneCommand() {
    try {
        const api = await utils_1.getApi();
        const user = await utils_1.getUser();
        const socket = utils_1.getSocket();
        new memory_pane_1.MemoryPane(user, api, socket, new service_1.Service());
    }
    catch (err) {
        // Ignore.
    }
}
exports.showMemoryPaneCommand = showMemoryPaneCommand;
//# sourceMappingURL=show-memory-pane.js.map