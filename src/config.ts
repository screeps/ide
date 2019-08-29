interface IAtomConfig {
    showOnStartup: any;
    showProjectConfig: any;
    global: any;
}

export const PACKAGE_NAME = 'screeps-ide';

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
            title: 'Server API URL',
            description: '',
            type: 'string',
            default: 'https://screeps.com/api',
            order: 2
        },

        websocketUrl: {
            title: 'Server socket URL',
            description: '',
            type: 'string',
            default: 'https://screeps.com/socket',
            order: 3
        },

        src: {
            title: 'Project folder',
            description: '',
            type: 'string',
            default: './dist',
            order: 4
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
        description: 'Show hidden config files in local projects.'
    },

    global
};

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