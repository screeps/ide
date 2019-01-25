"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_pane_1 = require("../components/memory-pane");
const service_1 = require("../service");
async function showMemoryPaneCommand() {
    new memory_pane_1.MemoryPane(new service_1.Service());
}
exports.showMemoryPaneCommand = showMemoryPaneCommand;
//# sourceMappingURL=show-memory-pane.js.map