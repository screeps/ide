"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const operators_1 = require("rxjs/operators");
const config_1 = require("../config");
const utils_1 = require("../utils");
const store_1 = require("../store");
const state_1 = require("../state");
const actions_1 = require("../components/screeps-panel/actions");
const PROJECT_ROOT_HEADER = '.project-root-header';
const PROJECT_SCREEPS_BRANCH = '.project-branch';
const PROJECT_EMPTY_BTN = 'screeps-download-btn';
let IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION = false;
function consumeTreeView(treeView) {
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
            assignScreepsIdeRc(treeProjectNodeRef);
            assignScreepsBranch(treeProjectNodeRef, projectConfig);
            assignScreepsSrcIcon(treeView, projectPath, projectConfig);
            treeProjectNodeRef.removeEventListener('click', updateIcon);
            treeProjectNodeRef.addEventListener('click', updateIcon);
        });
    })
        .subscribe();
    state_1.default
        .pipe(operators_1.map(({ projects }) => projects))
        .pipe(operators_1.distinctUntilChanged())
        .pipe(operators_1.tap((projects) => {
        if (!projects) {
            return;
        }
        try {
            Object.entries(projects).forEach(([, { files }]) => {
                Object.entries(files).forEach(([filePath, { hash, modified }]) => {
                    const treeFileNodeRef = treeView.entryForPath(filePath);
                    if (!treeFileNodeRef.classList.contains('file')) {
                        return;
                    }
                    if (!hash) {
                        treeFileNodeRef.classList.add('status-added');
                        return;
                    }
                    else {
                        treeFileNodeRef.classList.remove('status-added');
                    }
                    if (modified) {
                        treeFileNodeRef.classList.add('status-modified');
                    }
                    else {
                        treeFileNodeRef.classList.remove('status-modified');
                    }
                });
            });
        }
        catch (err) {
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
        store_1.default.dispatch({ type: 'REMOVE_PROJECT', payload: {} });
    });
    atom.config.observe(`${config_1.PACKAGE_NAME}.showProjectConfig`, updateIcon);
    const projects = atom.project.getPaths();
    if (projects.length) {
        IS_APPLIED_EXPAND_ITEM_SUBSCRIPTION = true;
        setTimeout(applyExpandItemSubscription);
        updateIcon();
    }
}
exports.consumeTreeView = consumeTreeView;
function updateIcon() {
    store_1.default.dispatch({ type: 'UPDATE_ICON', payload: {} });
}
function applyExpandItemSubscription() {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    atom.commands.add(treeViewPackage.mainModule.treeView.element, {
        'tree-view:expand-item': updateIcon
    });
}
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
        branchRef.classList.add('icon-screeps');
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
    btn.innerText = 'Fetch';
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
function assignScreepsIdeRc(projectRef) {
    const option = atom.config.get(`${config_1.PACKAGE_NAME}.showProjectConfig`);
    if (option) {
        projectRef.classList.remove('hide-screepsiderc');
    }
    else {
        projectRef.classList.add('hide-screepsiderc');
    }
}
//# sourceMappingURL=consume-tree-view.js.map