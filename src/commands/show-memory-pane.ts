import { getSocket, getApi, getUser } from '../utils';

import { Service } from '../service';
import { MemoryPane } from '../components/memory-pane';

let memoryPanel: MemoryPane;

export async function showMemoryPaneCommand() {
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

        memoryPanel = new MemoryPane(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
