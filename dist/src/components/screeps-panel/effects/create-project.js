"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const store_1 = require("../../../store");
const prompt_modal_1 = require("../../prompt-modal");
const actions_1 = require("../actions");
exports.createProjectEffect = store_1.default
    .effect(async (state, { type }) => {
    state;
    if (actions_1.CREATE_PROJECT !== type) {
        return;
    }
    try {
        const projectPath = await prompt_modal_1.default({
            legend: 'Please enter a new project fodler path:'
        });
        try {
            mkdir(projectPath);
        }
        catch (err) {
            return;
        }
        atom.project.addPath(projectPath);
    }
    catch (err) {
        throw err;
    }
});
function mkdir(targetDir) {
    const sep = path.sep;
    return targetDir.split(sep).reduce((parentDir, childDir) => {
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
}
//# sourceMappingURL=create-project.js.map