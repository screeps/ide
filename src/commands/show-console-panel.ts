import { getApi, getSocket, getUser } from '../utils';

import { Service } from '../service';
import { ConsolePanel } from '../components/console-panel';

let consolePanel: ConsolePanel;

export async function showConsolePanelCommand() {
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

        const api = await getApi();
        const user = await getUser();
        const socket = getSocket();

        consolePanel = new ConsolePanel(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
