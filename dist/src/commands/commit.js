"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const atom_1 = require("atom");
const utils_1 = require("../utils");
async function commit(event) {
    console.log(event);
    let path;
    if (event.target) {
        let target = event.target;
        if (target.nodeName === 'LI') {
            target = target.firstChild;
        }
        path = target.getAttribute('data-path');
    }
    if (!path) {
        console.log(1);
        // @ts-ignore
        path = atom.workspace.getCenter().getActivePaneItem().getPath();
    }
    if (!path) {
        throw new Error('No data-path');
    }
    const file = new atom_1.File(path);
    let content;
    try {
        content = await file.read();
    }
    catch (err) {
        throw new Error('Error read file');
    }
    // @ts-ignore
    const fileRef = atom.packages.getActivePackage('tree-view').mainModule
        .getTreeViewInstance()
        .entryForPath(path);
    const projectPath = await getProjectPathByEvent(fileRef);
    const { branch, src } = await utils_1.getScreepsProjectConfig(projectPath);
    if (!branch) {
        throw new Error('Need check branch');
    }
    const module = getModuleByPath(path, projectPath, src);
    if (!module) {
        throw new Error('Error get module');
    }
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    let { modules } = await api.getUserCode(branch);
    modules = Object.assign({}, modules, { [module]: content });
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
    atom.notifications.addSuccess(`Success commit ${module}.js`);
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
//# sourceMappingURL=commit.js.map