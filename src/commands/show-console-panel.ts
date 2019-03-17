import { tap, filter } from 'rxjs/operators';

import { getApi, getSocket, getUser } from '../utils';

import { Service } from '../service';
import { ConsolePanel, ACTION_CLOSE } from '../components/console-panel';

let consolePanel: ConsolePanel | null;

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

        consolePanel.events$
            .pipe(filter(({ type }) => type === ACTION_CLOSE))
            .pipe(tap(() => {
                consolePanel = null;
            }))
            .subscribe();
    } catch(err) {
        // Ignore.
    }
}
