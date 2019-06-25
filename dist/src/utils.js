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
const LOCAL_PROJECT_CONFIG = '.screepsiderc';
function $(s, el = document) {
    return el.querySelector(s);
}
exports.$ = $;
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
function getModuleByPath(modulePath) {
    const projectPath = atom.project.getPaths()[0];
    if (!projectPath) {
        return null;
    }
    const srcDir = config_1.configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);
    if (!modulePath.includes(fullPath) || modulePath === fullPath) {
        return null;
    }
    const matches = modulePath.match(/([^\\]+)$/gm);
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
        return /\.js$/.test(entry.getBaseName()) && entry.isFile();
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
        let modified = false;
        if (typeof _content !== 'undefined') {
            modified = !!(_content && _content !== content);
        }
        modules[module] = {
            content,
            modified
        };
    }
    return modules;
}
exports.combineModules = combineModules;
async function isScreepsProject(project) {
    const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);
    const configFile = new atom_1.File(configPath);
    if (await configFile.exists()) {
        return true;
    }
    return false;
}
exports.isScreepsProject = isScreepsProject;
async function createScreepsProjectConfig(project, settings) {
    try {
        const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);
        const configFile = new atom_1.File(configPath);
        const settingsStr = JSON.stringify(settings, null, '\t');
        await configFile.write(settingsStr);
        return configFile;
    }
    catch (err) {
        throw err;
    }
}
exports.createScreepsProjectConfig = createScreepsProjectConfig;
async function getScreepsProjectConfig(project) {
    try {
        const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);
        const configFile = new atom_1.File(configPath);
        const configStr = await configFile.read(true);
        let config = {};
        try {
            config = JSON.parse(configStr);
        }
        catch (err) {
        }
        return config;
    }
    catch (err) {
        throw err;
    }
}
exports.getScreepsProjectConfig = getScreepsProjectConfig;
function getScreepsProjectSrc(project, src = '') {
    return path.resolve(project, src);
}
exports.getScreepsProjectSrc = getScreepsProjectSrc;
//# sourceMappingURL=utils.js.map