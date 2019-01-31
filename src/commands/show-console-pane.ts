import { getApi, getSocket, getUser } from '../utils';

import { Service } from '../service';
import { ConsolePane } from '../components/console-pane';

export async function showConsolePaneCommand() {
    try {
        const api = await getApi();
        const user = await getUser();
        const socket = getSocket();

        new ConsolePane(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
