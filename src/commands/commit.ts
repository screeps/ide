const path = require('path');

import { File } from 'atom';

import {
    $,
    getApi, getUser,
    getScreepsProjectConfig
} from '../utils';
import { default as __state } from '../state';

export async function commit(event: CustomEvent) {
    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
    }

    let target: HTMLElement = event.target as HTMLElement;

    if (target.nodeName === 'LI') {
        target = target.firstChild as HTMLElement;
    }

    const path = target.getAttribute('data-path');

    if (!path) {
        throw new Error('No data-path');
    }

    const file = new File(path);

    let content;
    try {
        content = await file.read();
    } catch (err) {
        throw new Error('Error read file');
    }

    const projectPath = await getProjectPathByEvent(event);
    const { branch, src } = await getScreepsProjectConfig(projectPath);
    if (!branch) {
        throw new Error('Need check branch');
    }

    const module = getModuleByPath(path, projectPath, src);
    if (!module) {
        throw new Error('Error get module');
    }

    let { modules } = await api.getUserCode(branch);
    modules = {
        ...modules,
        [module]: content
    };

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }
}

async function getProjectPathByEvent(event: CustomEvent): Promise<any> {
    const target = event.target as HTMLElement;
    let projectRef = target.parentElement;

    while(projectRef && !projectRef.classList.contains('project-root')) {
        projectRef = projectRef.parentElement;

        if (projectRef === document.body) {
            return;
        }
    }

    if (!projectRef) {
        return;
    }

    const dataPathNodeRef = $('.project-root-header > span[data-path]', projectRef) as HTMLElement;

    if (!dataPathNodeRef) {
        return;
    }

    return dataPathNodeRef.getAttribute('data-path') as string;
}

function getModuleByPath(
    modulePath: string,
    projectPath: string,
    srcDir: string = ''
): string | null {
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
