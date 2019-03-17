import { getSocket, getApi, getUser } from '../utils';

import { Service } from '../service';
import { MemoryPanel } from '../components/memory-panel';

let memoryPanel: MemoryPanel;

export async function showMemoryPanelCommand() {
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

        const api = await getApi();
        const user = await getUser();
        const socket = getSocket();

        memoryPanel = new MemoryPanel(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
