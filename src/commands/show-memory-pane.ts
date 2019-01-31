import { getSocket, getApi, getUser } from '../utils';

import { Service } from '../service';
import { MemoryPane } from '../components/memory-pane';

export async function showMemoryPaneCommand() {
    try {
        const api = await getApi();
        const user = await getUser();
        const socket = getSocket();

        new MemoryPane(user, api, socket, new Service());
    } catch(err) {
        // Ignore.
    }
}
