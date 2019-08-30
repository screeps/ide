import {
    $,
    readUserCode,
    getScreepsProjectConfig,
    getScreepsProjectSrc,
} from '../utils';

import {
    updateUserCode
} from '../actions';

import { default as store } from '../store';
import { UpdateUserCodeSuccessAction } from '../store/actions';

export async function commit(event: CustomEvent) {
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

    const srcPath = getScreepsProjectSrc(projectPath, src);
    const modules = await readUserCode(srcPath);

    try {
        await updateUserCode(branch, modules);
    } catch(err) {
        throw new Error('Error update user code');
    }

    atom.notifications.addSuccess('Commit Success');
    store.dispatch(UpdateUserCodeSuccessAction(branch));
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
