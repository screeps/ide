import { Directory } from 'atom';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';

import { PACKAGE_NAME } from '../config';

import {
    $,
    isScreepsProject,
    getScreepsProjectSrc,
    getScreepsProjectConfig
} from '../utils';

import { default as store, Action } from '../store';
import { default as __state } from '../state';
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

            assignScreepsIdeRc(treeProjectNodeRef);
            assignScreepsBranch(treeProjectNodeRef, projectConfig);
            assignScreepsSrcIcon(treeView, projectPath, projectConfig);

            treeProjectNodeRef.removeEventListener('click', updateIcon);
            treeProjectNodeRef.addEventListener('click', updateIcon);
        });

    })
    .subscribe();

    __state
        .pipe(map(({ projects }) => projects))
        .pipe(distinctUntilChanged())
        .pipe(tap((projects) => {
            if (!projects) {
                return;
            }

            try {
                Object.entries(projects).forEach(([, { files }]) => {
                    Object.entries(files).forEach(([filePath, { hash, modified }]) => {
                        const treeFileNodeRef = treeView.entryForPath(filePath) as HTMLElement;

                        if (!treeFileNodeRef.classList.contains('file')) {
                            return;
                        }

                        if (!hash) {
                            treeFileNodeRef.classList.add('status-added');
                            return;
                        } else {
                            treeFileNodeRef.classList.remove('status-added');
                        }

                        if (modified) {
                            treeFileNodeRef.classList.add('status-modified');
                        } else {
                            treeFileNodeRef.classList.remove('status-modified');
                        }
                    });
                });
            } catch(err) {
                // Noop.
            }
        }))
        .subscribe();

    atom.project.onDidChangePaths((paths) => {
        if (paths.length) {
            // store.dispatch({ type: 'ADD_PROJECT', payload: {}});

            !IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION && applyExpandItemSubscription();

            return;
        }

        store.dispatch({ type: 'REMOVE_PROJECT', payload: {}});
    });

    atom.config.observe(`${ PACKAGE_NAME }.showProjectConfig`, updateIcon);

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
        branchRef.classList.add('icon-screeps');

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
    btn.innerText = 'Fetch';
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

function assignScreepsIdeRc(projectRef: HTMLElement) {
    const option = atom.config.get(`${ PACKAGE_NAME }.showProjectConfig`);

    if (option) {
        projectRef.classList.remove('hide-screepsiderc');
    } else {
        projectRef.classList.add('hide-screepsiderc');
    }
}
