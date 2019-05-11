"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_MODULES = 'UPDATE_MODULES';
function UpdateModulesAction(branch, modules) {
    return {
        type: exports.UPDATE_MODULES,
        payload: {
            branch,
            modules
        }
    };
}
exports.UpdateModulesAction = UpdateModulesAction;
//# sourceMappingURL=update.js.map