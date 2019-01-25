import { getSocket, getApi } from '../utils';

import { Service } from '../service';
import { ConsolePane } from '../components/console-pane';

export async function showConsolePaneCommand() {
    const api = getApi();
    const socket = getSocket();

    new ConsolePane(api, socket, new Service());
}
