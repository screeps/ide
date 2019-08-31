"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const actions_1 = require("../actions");
const state_1 = require("../../state");
const utils_1 = require("../../utils");
``;
exports.locaFileChangeEffect = index_1.default
    .effect(async (state, { type, payload: { path, content } }) => {
    if (type !== actions_1.LOCAL_FILE_CHANGE) {
        return;
    }
    const projectPath = selectProjectPath(path);
    if (!projectPath) {
        return;
    }
    const matches = /.*([^\\]+)\.js$/gm.exec(path);
    if (!matches) {
        return;
    }
    const [, module] = matches;
    const { branch } = await utils_1.getScreepsProjectConfig(projectPath);
    const modified = content !== state.modules[branch][module].content;
    index_1.default.dispatch(actions_1.LocalFileModifyAction(projectPath, path, modified));
});
function selectProjectPath(filePath) {
    const { projects } = state_1.default.getValue();
    if (!projects) {
        return;
    }
    const projectPath = Object.keys(projects).find((projectPath) => {
        return filePath.includes(projectPath);
    });
    return projectPath;
}
//# sourceMappingURL=local-file-change.js.map