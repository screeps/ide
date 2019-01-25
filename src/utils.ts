import { Api } from './api';
import { Socket } from './socket';
import { configGetter } from './config';

let api: Api;
let socket: Socket;

export function getApi() {
    if (api) {
        return api;
    }

    const apiUrl = configGetter('apiUrl');
    const token = configGetter('authToken');

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


