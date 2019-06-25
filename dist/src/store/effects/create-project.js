"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const atom_1 = require("atom");
const operators_1 = require("rxjs/operators");
const __1 = require("..");
const atom_modal_1 = require("../../components/atom-modal");
const confirm_modal_1 = require("../../components/confirm-modal");
const create_project_view_1 = require("../../../ui/components/create-project-view");
const actions_1 = require("../actions");
const utils_1 = require("../../utils");
exports.createProjectEffect = __1.default
    .effect(async (state, { type, payload }) => {
    state;
    if (actions_1.CREATE_PROJECT !== type) {
        return;
    }
    try {
        const { projectPath, download, branch } = await new Promise((resolve, reject) => {
            const createProjectModal = new atom_modal_1.AtomModal(create_project_view_1.default, Object.assign({ branch: state.branch, branches: state.branches }, payload));
            createProjectModal.events$
                .pipe(operators_1.filter(({ type }) => type === 'MODAL_SUBMIT'))
                .pipe(operators_1.tap(() => createProjectModal.hide()))
                .pipe(operators_1.tap(({ payload }) => resolve(payload)))
                .subscribe();
            createProjectModal.events$
                .pipe(operators_1.filter(({ type }) => type === 'MODAL_CANCEL'))
                .pipe(operators_1.tap(() => reject(null)))
                .subscribe();
        });
        const projectDir = mkdir(projectPath);
        const configFile = await utils_1.createScreepsProjectConfig(projectPath, {
            branch
        });
        if (download) {
            try {
                const projectEntries = await projectDir.getEntriesSync();
                if (!payload.downloadForce) {
                    if ((projectEntries.length > 1) ||
                        (projectEntries.length === 1 && projectEntries[0].getPath() !== configFile.getPath())) {
                        await confirm_modal_1.default({
                            legend: 'Folder is not empty! Would you like to continue?'
                        });
                    }
                }
                const api = await utils_1.getApi();
                const { modules } = await api.getUserCode(branch);
                for (const moduleName in modules) {
                    const content = modules[moduleName];
                    const modulePath = path.resolve(projectPath, moduleName);
                    const moduleFile = new atom_1.File(`${modulePath}.js`);
                    await moduleFile.write(content || '');
                }
            }
            catch (err) {
                // Noop.
            }
        }
        atom.project.addPath(projectPath);
        __1.default.dispatch({ type: 'CHANGE_PROJECT', payload: {} });
    }
    catch (err) {
        throw err;
    }
});
function mkdir(targetDir) {
    const sep = path.sep;
    const dir = targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve('/', parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        }
        catch (err) {
            if (err.code === 'EEXIST') {
                return curDir;
            }
            if (err.code === 'ENOENT') {
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }
            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw err;
            }
        }
        return curDir;
    });
    return new atom_1.Directory(dir);
}
//# sourceMappingURL=create-project.js.map