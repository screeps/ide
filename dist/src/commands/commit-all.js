"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
async function commitAll(event) {
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
    const projectPath = dataPathNodeRef.getAttribute('data-path');
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
    const modules = await utils_1.readUserCode(srcPath);
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
    atom.notifications.addSuccess('Commit All Success');
}
exports.commitAll = commitAll;
//# sourceMappingURL=commit-all.js.map