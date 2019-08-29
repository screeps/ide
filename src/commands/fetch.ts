const path = require('path');

import { File } from 'atom';

import {
    $,
    getApi, getUser,
    getScreepsProjectConfig,
    getScreepsProjectSrc,
} from '../utils';

import { default as confirm } from '../components/confirm-modal';

export async function fetch(event: CustomEvent) {
    await confirm({
        legend: 'Local changes will be overwritten.'
    });

    let dataPath; 
    if (event.target) {
        let target: HTMLElement = event.target as HTMLElement;

        if (target.nodeName === 'LI') {
            target = target.firstChild as HTMLElement;
        }

        dataPath = target.getAttribute('data-path');
    }

    if (!dataPath) {
        // @ts-ignore
        dataPath = atom.workspace.getCenter().getActivePaneItem().getPath() as string;
    }

    if (!dataPath) {
        throw new Error('No data-path');
    }

    // @ts-ignore
    const fileRef = atom.packages.getActivePackage('tree-view').mainModule
        .getTreeViewInstance()
        .entryForPath(dataPath);

    const projectPath = await getProjectPathByEvent(fileRef);

    const { branch, src } = await getScreepsProjectConfig(projectPath);
    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
    }

    const srcPath = getScreepsProjectSrc(projectPath, src);
    const { modules } = await api.getUserCode(branch);

    for (const moduleName in modules) {
        const content = modules[moduleName];
        const modulePath = path.resolve(srcPath, moduleName);

        const moduleFile = new File(`${ modulePath }.js`);
        await moduleFile.write(content || '');
    }
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
