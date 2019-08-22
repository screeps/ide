const path = require('path');

import { File } from 'atom';

import {
    $,
    getApi, getUser,
    getScreepsProjectConfig
} from '../utils';
import { default as __state } from '../state';

export async function commit(event: CustomEvent) {
    console.log(event);

    let path; 
    if (event.target) {
        let target: HTMLElement = event.target as HTMLElement;

        if (target.nodeName === 'LI') {
            target = target.firstChild as HTMLElement;
        }

        path = target.getAttribute('data-path');
    }

    if (!path) {
        console.log(1);
        // @ts-ignore
        path = atom.workspace.getCenter().getActivePaneItem().getPath() as string;
    }

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

    // @ts-ignore
    const fileRef = atom.packages.getActivePackage('tree-view').mainModule
        .getTreeViewInstance()
        .entryForPath(path);

    const projectPath = await getProjectPathByEvent(fileRef);
    const { branch, src } = await getScreepsProjectConfig(projectPath);
    if (!branch) {
        throw new Error('Need check branch');
    }

    const module = getModuleByPath(path, projectPath, src);
    if (!module) {
        throw new Error('Error get module');
    }

    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
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

    atom.notifications.addSuccess(`Success commit ${ module }.js`);
}

async function getProjectPathByEvent(projectRef: HTMLElement | null): Promise<any> {
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
