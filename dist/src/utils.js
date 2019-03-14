"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const socket_1 = require("./socket");
const config_1 = require("./config");
const user_1 = require("./services/user");
const auth_1 = require("./commands/auth");
let api;
let socket;
async function getApi() {
    if (api) {
        return api;
    }
    const token = config_1.configGetter('authToken');
    if (!token) {
        api = await auth_1.authCommand();
        return api;
    }
    const apiUrl = config_1.configGetter('apiUrl');
    api = new api_1.Api({
        url: apiUrl,
        token
    });
    return api;
}
exports.getApi = getApi;
function getSocket() {
    if (socket) {
        return socket;
    }
    const websocketUrl = config_1.configGetter('websocketUrl');
    const token = config_1.configGetter('authToken');
    socket = new socket_1.Socket({
        url: websocketUrl,
        token
    });
    return socket;
}
exports.getSocket = getSocket;
const _watches = [
    { path: '', value: {} },
    { path: 'creeps' },
    { path: 'spawns' },
    { path: 'rooms' },
    { path: 'flags' }
];
const MEMORY_WATCHES = 'memory-watches';
function getWatches() {
    let watches;
    try {
        watches = localStorage.getItem(MEMORY_WATCHES);
        if (!watches) {
            throw new Error('empty');
        }
        watches = JSON.parse(watches);
    }
    catch (err) {
        localStorage.setItem(MEMORY_WATCHES, JSON.stringify(_watches));
        watches = _watches;
    }
    return watches;
}
exports.getWatches = getWatches;
function putWatches(watches) {
    try {
        localStorage.setItem(MEMORY_WATCHES, JSON.stringify(watches));
    }
    catch (err) {
        // Noop.
    }
}
exports.putWatches = putWatches;
let user;
async function getUser() {
    if (user) {
        return user;
    }
    try {
        const data = await api.getAuhtMe();
        user = new user_1.User(data);
    }
    catch (err) {
        if (err !== 'unauthorized') {
            throw err;
        }
        const _api = await auth_1.authCommand();
        Object.assign(api, _api);
        user = await getUser();
    }
    return user;
}
exports.getUser = getUser;
//# sourceMappingURL=utils.js.map