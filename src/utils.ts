import { Api } from './api';
import { Socket } from './socket';
import { configGetter } from './config';
import { User } from './services/user';

import { authCommand } from './commands/auth';

let api: Api;
let socket: Socket;

export async function getApi(): Promise<any> {
    if (api) {
        return api;
    }

    const token = configGetter('authToken');

    if (!token) {
        api = await authCommand();
        return api;
    }

    const apiUrl = configGetter('apiUrl');

    api = new Api({
        url: apiUrl,
        token
    });

    return api;
}

export function getSocket() {
    if (socket) {
        return socket;
    }

    const websocketUrl = configGetter('websocketUrl');
    const token = configGetter('authToken');

    socket = new Socket({
        url: websocketUrl,
        token
    });

    return socket;
}

const _watches: any = [
    {path: '', value: '[object Object]'},
    {path: 'creeps'},
    {path: 'spawns'},
    {path: 'rooms'},
    {path: 'flags'}
];
const MEMORY_WATCHES = 'memory-watches';
export function getWatches() {
    let watches;

    try {
        watches = localStorage.getItem(MEMORY_WATCHES);

        if (!watches) {
            throw new Error('empty');
        }

        watches = JSON.parse(watches);
    } catch(err) {
        localStorage.setItem(MEMORY_WATCHES, JSON.stringify(_watches));
        watches = _watches;
    }

    return watches;
}

export function putWatches(watches: any) {
    try {
        localStorage.setItem(MEMORY_WATCHES, JSON.stringify(watches));
    } catch(err) {
        // Noop.
    }
}

let user: User;
export async function getUser(): Promise<User> {
    if (user) {
        return user;
    }

    try {
        const data = await api.getAuhtMe();
        user = new User(data);
    } catch(err) {
        if (err !== 'unauthorized') {
            throw err;
        }

        api = await authCommand();
        user = await getUser();
    }

    return user;
}
