import {
    $,
    readUserCode,
    getScreepsProjectConfig,
    getScreepsProjectSrc,
} from '../utils';

import {
    updateUserCode
} from '../actions';

import { selectProjectPath } from '../state';
import { default as confirm } from '../components/confirm-modal';

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

    let hasUnsaved = false;
    const textEditors = atom.workspace.getTextEditors();
    const unsavedTextEditors = [];

    for (const textEditor of textEditors) {
        const filePath = textEditor.getPath() as string;

        if (!textEditor.isModified()) {
            continue;
        }

        const _projectPath = selectProjectPath(filePath);
        if (projectPath !== _projectPath) {
            continue;
        }

        hasUnsaved = true;
        unsavedTextEditors.push(textEditor);
    }

    if (hasUnsaved) {
        try {
            await confirm({
                legend: 'There are unsaved changes in your local files. Do you want to save them before commit?',
                submitBtn: 'Save & Commit'
            });

            for(const textEditor of unsavedTextEditors) {
                await textEditor.save();
            }
        } catch(err) {
            return;
        }
    }

    const { branch, src } = await getScreepsProjectConfig(projectPath);

    const srcPath = getScreepsProjectSrc(projectPath, src);
    const modules = await readUserCode(srcPath);

    try {
        await updateUserCode(branch, modules);
    } catch(err) {
        throw new Error('Error update user code');
    }

    atom.notifications.addSuccess(`Committed successfully to branch "${ branch }"`);
    store.dispatch(UpdateUserCodeSuccessAction(projectPath, branch, modules));
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
