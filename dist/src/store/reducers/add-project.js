"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const actions_1 = require("../actions");
index_1.default.reducer((state, { type, payload: { projectPath, branch, files } }) => {
    if (type !== actions_1.ADD_PROJECT) {
        return state;
    }
    files = files || {};
    const projects = state.projects || {};
    return Object.assign({}, state, { projects: Object.assign({}, projects, { [projectPath]: {
                branch,
                files
            } }) });
});
//# sourceMappingURL=add-project.js.map