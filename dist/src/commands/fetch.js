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
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    let target = event.target;
    if (target.nodeName === 'LI') {
        target = target.firstChild;
    }
    const path = target.getAttribute('data-path');
    if (!path) {
        throw new Error('No data-path');
    }
    const projectPath = await getProjectPathByEvent(event);
    const { branch, src } = await utils_1.getScreepsProjectConfig(projectPath);
    if (!branch) {
        throw new Error('Need check branch');
    }
    const module = getModuleByPath(path, projectPath, src);
    if (!module) {
        throw new Error('Error get module');
    }
    const { modules } = await api.getUserCode(branch);
    const content = modules[module];
    const moduleFile = new atom_1.File(`${path}`);
    await moduleFile.write(content || '');
}
exports.fetch = fetch;
async function getProjectPathByEvent(event) {
    const target = event.target;
    let projectRef = target.parentElement;
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
function getModuleByPath(modulePath, projectPath, srcDir = '') {
    const fullPath = path.resolve(projectPath, srcDir);
    if (!modulePath.includes(fullPath) || modulePath === fullPath) {
        return null;
    }
    const matches = modulePath.match(/([^\\]+)$/gm);
    if (matches && matches[0]) {
        const match = matches[0];
        return match.replace(/\.js$/, '');
    }
    return null;
}
//# sourceMappingURL=fetch.js.map