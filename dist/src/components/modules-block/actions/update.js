"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_MODULE = 'UPDATE_MODULE';
function UpdateModuleAction(branch, module, content) {
    return {
        type: exports.UPDATE_MODULE,
        payload: {
            branch,
            module,
            content
        }
    };
}
exports.UpdateModuleAction = UpdateModuleAction;
//# sourceMappingURL=update.js.map