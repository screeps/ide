const fs = require('fs');
const path = require('path');

interface IAtomConfig {
    showOnStartup: any;
    showProjectConfig: any;
    global: any;
    local?: any;
}

interface IAtomConfigProperties {
    [key: string]: object;
}

let local: {
    properties: IAtomConfigProperties;
};

const properties: IAtomConfigProperties = {
    authToken: {
        title: 'Auth token',
        description: '',
        type: 'string',
        default: '',
        order: 1
    },

    apiUrl: {
        title: 'Screep API url',
        description: '',
        type: 'string',
        default: '',
        order: 1
    },

    websocketUrl: {
        title: 'Screep websocket Url',
        description: '',
        type: 'string',
        default: '',
        order: 1
    },

    src: {
        title: 'Project folder',
        description: '',
        type: 'string',
        default: '',
        order: 1
    }
};

export const PACKAGE_NAME = 'screeps-ide';
const LOCAL_PROJECT_CONFIG = '.screepsiderc'

try {
    atom.config.unset(`${ PACKAGE_NAME }.local`);

    const paths = atom.project.getPaths();
    const _path = path.resolve(paths[0], LOCAL_PROJECT_CONFIG);

    const _buffer = fs.readFileSync(_path);
    const _config = JSON.parse(_buffer.toString());

    for (let prop in _config) {
        if (!_config[prop] || !properties[prop]) {
            continue;
        }

        //@ts-ignore
        local = local || {
            title: 'Per-project',
            type: 'object',
            order: 1,
            properties: {}
        };

        local.properties[prop] = properties[prop];

        atom.config.set(`${ PACKAGE_NAME }.local.${ prop }`, _config[prop]);
    }

} catch(err) {
    // Noop.
}

const _global = {
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

let config: IAtomConfig = {
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

    global: _global
};

//@ts-ignore
if (local) {
    config.local = local;
}

export default config;

export function configGetter(name: string): string | boolean {
    let value = atom.config.get(`${ PACKAGE_NAME }.${ name }`);

    if (!value) {
        value = atom.config.get(`${ PACKAGE_NAME }.local.${ name }`);
    }

    if (!value) {
        value = atom.config.get(`${ PACKAGE_NAME }.global.${ name }`);
    }

    return value;
}

export function configSetter(name: string, value: string | boolean) {
    atom.config.set(`${ PACKAGE_NAME }.${ name }`, value);
}