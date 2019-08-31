"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const index_1 = require("../index");
const actions_1 = require("../actions");
const utils_1 = require("../../utils");
index_1.default.reducer((state, { type, payload: { projectPath, modules } }) => {
    if (type !== actions_1.UPDATE_USER_CODE_SUCCESS) {
        return state;
    }
    const project = state.projects[projectPath];
    const files = {};
    for (const moduleName in modules) {
        const content = modules[moduleName];
        const modulePath = path.resolve(projectPath, moduleName);
        const hash = utils_1.hashCode(content || '');
        files[`${modulePath}.js`] = { hash };
    }
    return Object.assign({}, state, { projects: Object.assign({}, state.projects, { [projectPath]: Object.assign({}, project, { files }) }) });
});
//# sourceMappingURL=update-user-code-success.js.map