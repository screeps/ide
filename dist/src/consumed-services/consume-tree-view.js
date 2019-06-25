"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("../utils");
const store_1 = require("../store");
const actions_1 = require("../components/screeps-panel/actions");
const PROJECT_ROOT_HEADER = '.project-root-header';
const PROJECT_SCREEPS_BRANCH = '.project-branch';
const PROJECT_EMPTY_BTN = 'screeps-download-btn';
function consumeTreeView(treeView) {
    const updateIcon = () => {
        store_1.default.dispatch({ type: 'UPDATE_ICON', payload: {} });
    };
    store_1.default.effect(async (state, { type }) => {
        if (![actions_1.ADD_PROJECT, 'UPDATE_ICON', 'CHANGE_PROJECT'].includes(type)) {
            return state;
        }
        const projects = atom.project.getPaths();
        projects.forEach(async (projectPath) => {
            const projectDir = new atom_1.Directory(projectPath);
            const treeProjectNodeRef = treeView.entryForPath(projectPath);
            toggleFolderEmptyBtn(treeProjectNodeRef, projectDir);
            if (!(await utils_1.isScreepsProject(projectPath))) {
                return;
            }
            const projectConfig = await utils_1.getScreepsProjectConfig(projectPath);
            assignScreepsBranch(treeProjectNodeRef, projectConfig);
            assignScreepsSrcIcon(treeView, projectPath, projectConfig);
            treeProjectNodeRef.removeEventListener('click', updateIcon);
            treeProjectNodeRef.addEventListener('click', updateIcon);
        });
    })
        .subscribe();
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    atom.commands.add(treeViewPackage.mainModule.treeView.element, {
        'tree-view:expand-item': updateIcon
    });
    atom.project.onDidChangePaths((paths) => {
        if (paths.length) {
            store_1.default.dispatch({ type: 'ADD_PROJECT', payload: {} });
            return;
        }
        store_1.default.dispatch({ type: 'REMOVE_PROJECT', payload: {} });
    });
    updateIcon();
}
exports.consumeTreeView = consumeTreeView;
function assignScreepsSrcIcon(treeView, projectPath, cfg) {
    const dataPath = utils_1.getScreepsProjectSrc(projectPath, cfg.src);
    const entry = treeView.entryForPath(dataPath);
    const iconRef = utils_1.$('.header > .icon-file-directory', entry);
    if (iconRef.getAttribute('data-path') !== dataPath) {
        return;
    }
    entry.setAttribute('screeps-dist', 'screeps-dist');
}
function assignScreepsBranch(projectRef, cfg) {
    const headerRef = utils_1.$(PROJECT_ROOT_HEADER, projectRef);
    if (!headerRef) {
        return;
    }
    let branchRef = utils_1.$(PROJECT_SCREEPS_BRANCH, headerRef);
    if (!branchRef) {
        branchRef = document.createElement('span');
        branchRef.classList.add('project-branch');
        headerRef.appendChild(branchRef);
    }
    branchRef.innerText = `${cfg.branch}`;
}
function toggleFolderEmptyBtn(projectRef, projectDir) {
    const entries = projectDir.getEntriesSync();
    let div = utils_1.$(`.${PROJECT_EMPTY_BTN}`, projectRef);
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
        store_1.default.dispatch({
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
//# sourceMappingURL=consume-tree-view.js.map