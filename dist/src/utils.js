"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const socket_1 = require("./socket");
const config_1 = require("./config");
let api;
let socket;
function getApi() {
    if (api) {
        return api;
    }
    const apiUrl = config_1.configGetter('apiUrl');
    const token = config_1.configGetter('authToken');
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
//# sourceMappingURL=utils.js.map