"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_MODULE = 'CREATE_MODULE';
function CreateModuleAction(branch, module) {
    return {
        type: exports.CREATE_MODULE,
        payload: {
            branch,
            module
        }
    };
}
exports.CreateModuleAction = CreateModuleAction;
//# sourceMappingURL=create.js.map