"use strict";
// import { tap, filter } from 'rxjs/operators';
Object.defineProperty(exports, "__esModule", { value: true });
// import { getSocket, getApi, getUser } from '../utils';
// import { Service } from '../service';
// import { MemoryPanel, ACTION_CLOSE } from '../components/memory-panel';
// let memoryPanel: MemoryPanel | null;
async function showMemoryPanelCommand() {
    // try {
    //     if (memoryPanel && memoryPanel.isVisible) {
    //         return;
    //     }
    //     atom.workspace.getBottomPanels().forEach((panel) => {
    //         panel.hide();
    //     });
    //     if (memoryPanel && !memoryPanel.isVisible) {
    //         memoryPanel.show();
    //         return;
    //     }
    //     const api = await getApi();
    //     const user = await getUser();
    //     const socket = getSocket();
    //     memoryPanel = new MemoryPanel(user, api, socket, new Service());
    //     memoryPanel.events$
    //         .pipe(filter(({ type }) => type === ACTION_CLOSE))
    //         .pipe(tap(() => {
    //             memoryPanel = null;
    //         }))
    //         .subscribe();
    // } catch(err) {
    //     // Ignore.
    // }
}
exports.showMemoryPanelCommand = showMemoryPanelCommand;
//# sourceMappingURL=show-memory-panel.js.map