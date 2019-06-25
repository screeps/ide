import {
    $,
    readUserCode,
    getApi, getUser,
    getScreepsProjectConfig,
    getScreepsProjectSrc,
} from '../utils';

export async function commitAll(event: CustomEvent) {
    const target = event.target as HTMLElement;
    let projectRef = target.parentElement;

    while(projectRef && !projectRef.classList.contains('project-root')) {
        projectRef = target.parentElement;

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
    const modules = await readUserCode(srcPath);

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }
}
