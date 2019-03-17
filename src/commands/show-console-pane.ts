import { getApi, getSocket, getUser } from '../utils';

import { Service } from '../service';
import { ConsolePane } from '../components/console-pane';

let consolePanel: ConsolePane;

export async function showConsolePaneCommand() {
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

        consolePanel = new ConsolePane(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
