const path = require('path');
import { File, Directory, DisposableLike } from 'atom';

import { Api } from './api';
import { Socket } from './socket';
import { PACKAGE_NAME, configGetter } from './config';
import { User } from './services/user';

import { authCommand } from './commands/auth';

let api: Api;
let socket: Socket;

export const LOCAL_PROJECT_CONFIG = '.screepsiderc';
export const TERN_CONFIG_PATH = '.tern-project';
export const TERN_CONFIG_DEFAULT = { libs: ['screeps'] };

export function guid() {
    return parseInt(Math.random().toString().substr(2)).toString(16);
}

export function $(s: string, el: HTMLElement | Document = document) {
    return el.querySelector(s);
}

export async function getApi(): Promise<Api> {
    if (api) {
        return api;
    }

    const token = configGetter('authToken') as string;

    if (!token) {
        try {
            api = await authCommand();
        } catch (err) {
            throw new Error(err);
        }
        return api;
    }

    const apiUrl = configGetter('apiUrl') as string;

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

    const websocketUrl = configGetter('websocketUrl') as string;
    const token = configGetter('authToken') as string;

    socket = new Socket({
        url: websocketUrl,
        token
    });

    return socket;
}

const _watches: any = [
    {_id: 'root', path: '', value: {}},
    {_id: 'creeps', path: 'creeps'},
    {_id: 'spawns', path: 'spawns'},
    {_id: 'rooms', path: 'rooms'},
    {_id: 'flags', path: 'flags'}
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
        watches = watches.map(({ _id, path, value }: any): any => {
            if (!_id) {
                const watcher = _watches.find((_: any) => _.path === path);
                if (watcher) {
                    _id = watcher._id;
                } else {
                    _id = guid();
                }
            }

            return { _id, path, value };
        });

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

        const _api = await authCommand();
        Object.assign(api, _api);
        user = await getUser();
    }

    return user;
}

export function getBranchPath(branch: string): string {
    // @ts-ignore
    return path.resolve(`${ atom.packages.packageDirPaths }`, PACKAGE_NAME, `.branches/${ branch }`);
}

export function getModulePath(branch: string, module: string): string {
    const extension = /\.js/.test(module) ? '' : '.js';

    // @ts-ignore
    const branchPath = getBranchPath(branch);
    return path.resolve(`${ branchPath }/${ module }${ extension }`);
}

export async function readUserCode(fullPath: string): Promise<IModulesData> {
    const dir = new Directory(fullPath);
    const entries = dir.getEntriesSync();

    const files = entries.filter((entry) => {
        return /\.js$/.test(entry.getBaseName()) && entry.isFile();
    }) as File[];

    const modules: { [key: string]: string } = {};

    for (let file of files) {
        const content = await file.read(true) as string;
        const fileName = file.getBaseName()
            .replace(/\.js$/, '');

        modules[fileName] = content;
    }

    return modules;
}

export function combineModules(
    origin: IModulesData,
    changes: IModulesData = {}
): { [key: string]: IModule; } {
    const modules: { [key: string]: IModule; } = {};
    const entries = Object.entries(origin);

    for(let i = 0, l = entries.length; i < l; i++) {
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

export async function isScreepsProject(project: string) {
    const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);

    const configFile = new File(configPath);

    if (await configFile.exists()) {
        return true;
    }

    return false;
}

export async function createScreepsProjectConfig(project: string, settings: any): Promise<File> {
    try {
        const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);
        const configFile: File = new File(configPath);
        const settingsStr = JSON.stringify(settings, null, '\t');

        await configFile.write(settingsStr);

        return configFile;
    } catch (err) {
        throw err;
    }
}

export async function createScreepsTernConfig(project: string, settings: any = TERN_CONFIG_DEFAULT): Promise<File> {
    try {
        const configPath = path.resolve(project, TERN_CONFIG_PATH);
        const configFile: File = new File(configPath);
        const settingsStr = JSON.stringify(settings, null, '\t');

        await configFile.write(settingsStr);

        return configFile;
    } catch (err) {
        throw err;
    }
}


export async function getScreepsProjectConfig(project: string): Promise<any> {
    try {
        const configPath = path.resolve(project, LOCAL_PROJECT_CONFIG);

        const configFile = new File(configPath);
        const configStr = await configFile.read(true) as string;

        let config = {};
        try {
            config = JSON.parse(configStr);
        } catch (err) {
        }

        return config;
    } catch (err) {
        throw err;
    }
}

export function getScreepsProjectSrc(project: string, src: string = ''): string {
    return path.resolve(project, src);
}

export function applyTooltip(
    selector: string,
    title: string,
    context: HTMLElement | Document = document
): DisposableLike | void {
    const elementRef = $(selector, context) as HTMLElement;
    let disposable;

    if (!elementRef) {
        return;
    };

    disposable = atom.tooltips.add(elementRef, {
        title
    });

    return disposable;
}

export function hashCode(str: string): number {
    var hash = 0, i, chr;

    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
};