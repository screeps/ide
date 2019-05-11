"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_MODULE = 'DELETE_MODULE';
function DeleteModuleAction(branch, module) {
    return {
        type: exports.DELETE_MODULE,
        payload: {
            branch,
            module
        }
    };
}
exports.DeleteModuleAction = DeleteModuleAction;
//# sourceMappingURL=delete.js.map