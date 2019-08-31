"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADD_PROJECT = 'ADD_PROJECT';
function AddProjectAction(projectPath, branch, files) {
    return {
        type: exports.ADD_PROJECT,
        payload: {
            projectPath,
            branch,
            files
        }
    };
}
exports.AddProjectAction = AddProjectAction;
//# sourceMappingURL=add-project.js.map