"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const actions_1 = require("../actions");
const state_1 = require("../state");
const confirm_modal_1 = require("../components/confirm-modal");
const store_1 = require("../store");
const actions_2 = require("../store/actions");
async function commit(event) {
    let dataPath;
    if (event.target) {
        let target = event.target;
        if (target.nodeName === 'LI') {
            target = target.firstChild;
        }
        dataPath = target.getAttribute('data-path');
    }
    if (!dataPath) {
        // @ts-ignore
        dataPath = atom.workspace.getCenter().getActivePaneItem().getPath();
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
        const filePath = textEditor.getPath();
        if (!textEditor.isModified()) {
            continue;
        }
        const _projectPath = state_1.selectProjectPath(filePath);
        if (projectPath !== _projectPath) {
            continue;
        }
        hasUnsaved = true;
        unsavedTextEditors.push(textEditor);
    }
    if (hasUnsaved) {
        try {
            await confirm_modal_1.default({
                legend: 'There are unsaved changes in your local files. Do you want to save them before commit?',
                submitBtn: 'Save & Commit'
            });
            for (const textEditor of unsavedTextEditors) {
                await textEditor.save();
            }
        }
        catch (err) {
            return;
        }
    }
    const { branch, src } = await utils_1.getScreepsProjectConfig(projectPath);
    const srcPath = utils_1.getScreepsProjectSrc(projectPath, src);
    const modules = await utils_1.readUserCode(srcPath);
    try {
        await actions_1.updateUserCode(branch, modules);
    }
    catch (err) {
        throw new Error('Error update user code');
    }
    atom.notifications.addSuccess(`Committed successfully to branch "${branch}"`);
    store_1.default.dispatch(actions_2.UpdateUserCodeSuccessAction(projectPath, branch, modules));
}
exports.commit = commit;
async function getProjectPathByEvent(projectRef) {
    while (projectRef && !projectRef.classList.contains('project-root')) {
        projectRef = projectRef.parentElement;
        if (projectRef === document.body) {
            return;
        }
    }
    if (!projectRef) {
        return;
    }
    const dataPathNodeRef = utils_1.$('.project-root-header > span[data-path]', projectRef);
    if (!dataPathNodeRef) {
        return;
    }
    return dataPathNodeRef.getAttribute('data-path');
}
//# sourceMappingURL=commit.js.map