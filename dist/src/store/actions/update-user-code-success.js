"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_USER_CODE_SUCCESS = 'UPDATE_USER_CODE_SUCCESS';
function UpdateUserCodeSuccessAction(projectPath, branch, modules) {
    return {
        type: exports.UPDATE_USER_CODE_SUCCESS,
        payload: {
            projectPath,
            branch,
            modules
        }
    };
}
exports.UpdateUserCodeSuccessAction = UpdateUserCodeSuccessAction;
//# sourceMappingURL=update-user-code-success.js.map