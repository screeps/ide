"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const atom_1 = require("atom");
const utils_1 = require("../utils");
const confirm_modal_1 = require("../components/confirm-modal");
async function fetch(event) {
    await confirm_modal_1.default({
        legend: 'Local changes will be overwritten.'
    });
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
    const { branch, src } = await utils_1.getScreepsProjectConfig(projectPath);
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    const srcPath = utils_1.getScreepsProjectSrc(projectPath, src);
    const { modules } = await api.getUserCode(branch);
    for (const moduleName in modules) {
        const content = modules[moduleName];
        const modulePath = path.resolve(srcPath, moduleName);
        const moduleFile = new atom_1.File(`${modulePath}.js`);
        await moduleFile.write(content || '');
    }
}
exports.fetch = fetch;
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
//# sourceMappingURL=fetch.js.map