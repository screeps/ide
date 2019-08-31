"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const actions_1 = require("../actions");
const state_1 = require("../../state");
index_1.default.reducer((state, { type, payload: { filePath } }) => {
    if (type !== actions_1.ADD_TEXT_EDITOR) {
        return state;
    }
    if (!filePath) {
        return state;
    }
    const projectPath = selectProjectPath(filePath);
    if (!projectPath) {
        return state;
    }
    const project = state.projects[projectPath];
    const file = project.files[filePath];
    if (file) {
        return state;
    }
    return Object.assign({}, state, { projects: Object.assign({}, state.projects, { [projectPath]: Object.assign({}, project, { files: Object.assign({}, project.files, { [filePath]: {} }) }) }) });
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
//# sourceMappingURL=add-text-editor.js.map