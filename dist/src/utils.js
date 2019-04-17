"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const atom_1 = require("atom");
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
        try {
            api = await auth_1.authCommand();
        }
        catch (err) {
            throw new Error(err);
        }
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
function getBranchPath(branch) {
    const projectPath = atom.project.getPaths()[0];
    if (projectPath) {
        const srcDir = config_1.configGetter('src');
        const fullPath = path.resolve(projectPath, srcDir);
        return fullPath;
    }
    // @ts-ignore
    return path.resolve(`${atom.packages.packageDirPaths}`, config_1.PACKAGE_NAME, `.branches/${branch}`);
}
exports.getBranchPath = getBranchPath;
function getModulePath(branch, module) {
    const extension = /\.js/.test(module) ? '' : '.js';
    // @ts-ignore
    const branchPath = getBranchPath(branch);
    return path.resolve(`${branchPath}/${module}${extension}`);
}
exports.getModulePath = getModulePath;
function getModuleByPath(path) {
    const srcDir = getBranchPath('');
    if (!path.includes(srcDir) || path === srcDir) {
        return null;
    }
    const matches = path.match(/([^\\]+)$/gm);
    if (matches && matches[0]) {
        const match = matches[0];
        return match.replace(/\.js$/, '');
    }
    return null;
}
exports.getModuleByPath = getModuleByPath;
async function readUserCode(fullPath) {
    const dir = new atom_1.Directory(fullPath);
    const entries = dir.getEntriesSync();
    const files = entries.filter((entry) => {
        return entry.isFile();
    });
    const modules = {};
    for (let file of files) {
        const content = await file.read(true);
        const fileName = file.getBaseName()
            .replace(/\.js$/, '');
        modules[fileName] = content;
    }
    return modules;
}
exports.readUserCode = readUserCode;
function combineModules(origin, changes = {}) {
    const modules = {};
    const entries = Object.entries(origin);
    for (let i = 0, l = entries.length; i < l; i++) {
        const [module, content] = entries[i];
        const _content = changes[module];
        const modified = !!(_content && _content !== content);
        modules[module] = {
            content,
            modified
        };
    }
    return modules;
}
exports.combineModules = combineModules;
//# sourceMappingURL=utils.js.map