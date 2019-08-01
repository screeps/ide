import { Directory } from 'atom';

import {
    $,
    isScreepsProject,
    getScreepsProjectSrc,
    getScreepsProjectConfig
} from '../utils';

import { default as store, Action } from '../store';
import {
    ADD_PROJECT
} from '../components/screeps-panel/actions';

const PROJECT_ROOT_HEADER = '.project-root-header';
const PROJECT_SCREEPS_BRANCH = '.project-branch';
const PROJECT_EMPTY_BTN = 'screeps-download-btn';

let IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION = false;

export function consumeTreeView(treeView: any) {
    store.effect(async (state: IState, { type }: Action) => {
        if (![ADD_PROJECT, 'UPDATE_ICON', 'CHANGE_PROJECT'].includes(type)) {
            return state;
        }

        const projects = atom.project.getPaths();

        projects.forEach(async (projectPath) => {
            const projectDir = new Directory(projectPath);
            const treeProjectNodeRef = treeView.entryForPath(projectPath) as HTMLElement;

            toggleFolderEmptyBtn(treeProjectNodeRef, projectDir);

            if (!(await isScreepsProject(projectPath))) {
                return;
            }

            const projectConfig = await getScreepsProjectConfig(projectPath);

            assignScreepsBranch(treeProjectNodeRef, projectConfig);

            assignScreepsSrcIcon(treeView, projectPath, projectConfig);

            treeProjectNodeRef.removeEventListener('click', updateIcon);
            treeProjectNodeRef.addEventListener('click', updateIcon);
        });

    })
    .subscribe();

    atom.project.onDidChangePaths((paths) => {
        if (paths.length) {
            store.dispatch({ type: 'ADD_PROJECT', payload: {}});

            !IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION && applyExpandItemSubscription();

            return;
        }

        store.dispatch({ type: 'REMOVE_PROJECT', payload: {}});
    });

    const projects = atom.project.getPaths();
    if (projects.length) {
        IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION = true;

        setTimeout(applyExpandItemSubscription);

        updateIcon();
    }
}

function updateIcon() {
    store.dispatch({ type: 'UPDATE_ICON', payload: {}});
}

function applyExpandItemSubscription() {
    const treeViewPackage: any = atom.packages.getActivePackage('tree-view');

    atom.commands.add(treeViewPackage.mainModule.treeView.element, {
        'tree-view:expand-item': updateIcon
    });
}

function assignScreepsSrcIcon(treeView: any, projectPath: string, cfg: any) {
    const dataPath = getScreepsProjectSrc(projectPath, cfg.src);

    const entry = treeView.entryForPath(dataPath) as HTMLElement;
    const iconRef = $('.header > .icon-file-directory', entry) as HTMLElement;

    if (iconRef.getAttribute('data-path') !== dataPath) {
        return;
    }

    entry.setAttribute('screeps-dist', 'screeps-dist');
}

function assignScreepsBranch(projectRef: HTMLElement, cfg: any)  {
    const headerRef = $(PROJECT_ROOT_HEADER, projectRef) as HTMLElement;

    if (!headerRef) {
        return;
    }

    let branchRef = $(PROJECT_SCREEPS_BRANCH, headerRef) as HTMLElement;

    if (!branchRef) {
        branchRef = document.createElement('span');
        branchRef.classList.add('project-branch');

        headerRef.appendChild(branchRef);
    }

    branchRef.innerText = `${ cfg.branch }`;
}

function toggleFolderEmptyBtn(projectRef: HTMLElement, projectDir: Directory) {
    const entries = projectDir.getEntriesSync();

    let div = $(`.${ PROJECT_EMPTY_BTN }`, projectRef);

    if (entries.length && !div) {
        return;
    }

    if (entries.length && div) {
        projectRef.removeChild(div);
        return;
    }

    if (div) {
        return;
    }

    div = document.createElement('div');
    div.classList.add(PROJECT_EMPTY_BTN);

    const btn = document.createElement('button');
    btn.innerText = 'Folder is empty you can download modules from screeps';
    btn.classList.add('btn');
    btn.style.whiteSpace = 'initial';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        store.dispatch({
            type: 'CREATE_PROJECT',
            payload: {
                projectPath: projectDir.getPath(),
                projectPathLabel: 'Project folder path',
                projectPathReadonly: true,
                downloadReadonly: true,
                submitBtn: 'Download'
            }
        });

        return false;
    });

    div.appendChild(btn);
    projectRef.appendChild(div);
}