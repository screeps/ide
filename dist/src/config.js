"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_NAME = 'screeps-ide';
const global = {
    title: 'Common',
    type: 'object',
    order: 1,
    properties: {
        authToken: {
            title: 'Auth token',
            description: '',
            type: 'string',
            default: '',
            order: 1
        },
        apiUrl: {
            title: 'Screep API Url',
            description: '',
            type: 'string',
            default: 'https://screeps.com/api',
            order: 1
        },
        websocketUrl: {
            title: 'Screep socket Url',
            description: '',
            type: 'string',
            default: 'https://screeps.com/socket',
            order: 1
        },
        src: {
            title: 'Project folder',
            description: '',
            type: 'string',
            default: './dist',
            order: 1
        }
    }
};
let config = {
    showOnStartup: {
        type: 'boolean',
        default: true,
        description: 'Show welcome panes with useful information when opening a new Atom window.'
    },
    showProjectConfig: {
        type: 'boolean',
        default: false,
        description: 'Show config .screepsiderc in local projects.'
    },
    global
};
exports.default = config;
function configGetter(name) {
    let value = atom.config.get(`${exports.PACKAGE_NAME}.${name}`);
    if (!value) {
        value = atom.config.get(`${exports.PACKAGE_NAME}.local.${name}`);
    }
    if (!value) {
        value = atom.config.get(`${exports.PACKAGE_NAME}.global.${name}`);
    }
    return value;
}
exports.configGetter = configGetter;
function configSetter(name, value) {
    atom.config.set(`${exports.PACKAGE_NAME}.${name}`, value);
}
exports.configSetter = configSetter;
//# sourceMappingURL=config.js.map