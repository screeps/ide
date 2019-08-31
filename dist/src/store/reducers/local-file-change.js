"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const actions_1 = require("../actions");
const state_1 = require("../../state");
const utils_1 = require("../../utils");
index_1.default.reducer((state, { type, payload: { filePath, content } }) => {
    if (type !== actions_1.LOCAL_FILE_CHANGE) {
        return state;
    }
    const projectPath = selectProjectPath(filePath);
    if (!projectPath) {
        return state;
    }
    const project = state.projects[projectPath];
    const file = project.files[filePath] || {};
    const hash = utils_1.hashCode(content);
    const modified = file.hash !== hash;
    return Object.assign({}, state, { projects: Object.assign({}, state.projects, { [projectPath]: Object.assign({}, project, { files: Object.assign({}, project.files, { [filePath]: Object.assign({}, file, { modified }) }) }) }) });
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