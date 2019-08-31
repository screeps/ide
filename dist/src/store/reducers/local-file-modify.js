"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const actions_1 = require("../actions");
index_1.default.reducer((state, { type, payload: { projectPath, filePath, modified } }) => {
    if (type !== actions_1.LOCAL_FILE_MODIFY) {
        return state;
    }
    const branch = state.projects[projectPath].branch;
    const files = state.files || {};
    return Object.assign({}, state, { files: Object.assign({}, files, { [branch]: Object.assign({}, files[branch], { [filePath]: modified }) }) });
});
//# sourceMappingURL=local-file-modify.js.map