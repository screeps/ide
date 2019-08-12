const path = require('path');

import { File } from 'atom';

import {
    $,
    getApi, getUser,
    getScreepsProjectConfig,
    getScreepsProjectSrc,
} from '../utils';

import { default as confirm } from '../components/confirm-modal';

export async function fetchAll(event: CustomEvent) {
    await confirm({
        legend: 'Local changes will be overwrite.'
    });

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

    const projectPath = dataPathNodeRef.getAttribute('data-path') as string;

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
