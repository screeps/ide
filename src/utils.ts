const path = require('path');
import { File, Directory } from 'atom';

import { Api } from './api';
import { Socket } from './socket';
import { PACKAGE_NAME, configGetter } from './config';
import { User } from './services/user';

import { authCommand } from './commands/auth';

let api: Api;
let socket: Socket;

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
    {path: '', value: {}},
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

        const _api = await authCommand();
        Object.assign(api, _api);
        user = await getUser();
    }

    return user;
}

export function getBranchPath(branch: string): string {
    const projectPath = atom.project.getPaths()[0];

    if (projectPath) {
        const srcDir = configGetter('src');
        const fullPath = path.resolve(projectPath, srcDir);

        return fullPath;
    }

    // @ts-ignore
    return path.resolve(`${ atom.packages.packageDirPaths }`, PACKAGE_NAME, `.branches/${ branch }`);
}

export function getModulePath(branch: string, module: string): string {
    const extension = /\.js/.test(module) ? '' : '.js';

    // @ts-ignore
    const branchPath = getBranchPath(branch);
    return path.resolve(`${ branchPath }/${ module }${ extension }`);
}

export function getModuleByPath(path: string): string | null {
    const srcDir = getBranchPath('');

    if (!path.includes(srcDir)) {
        return null;
    }

    const matches = path.match(/([^\\]+)$/gm);

    if (matches && matches[0]) {
        const match = matches[0];
        return match.replace(/\.js$/, '');
    }

    return null;
}

export async function readUserCode(fullPath: string): Promise<IModules> {
    const dir = new Directory(fullPath);
    const entries = dir.getEntriesSync();

    const files = entries.filter((entry) => {
        return entry.isFile();
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
    origin: IModules,
    changes: IModules = {}
): { [key: string]: IModule; } {
    const modules: { [key: string]: IModule; } = {};
    const entries = Object.entries(origin);

    for(let i = 0, l = entries.length; i < l; i++) {
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