"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODIFY_MODULE = 'MODIFY_MODULE';
function ModifyModuleAction(branch, module, modified) {
    return {
        type: exports.MODIFY_MODULE,
        payload: {
            branch,
            module,
            modified
        }
    };
}
exports.ModifyModuleAction = ModifyModuleAction;
//# sourceMappingURL=modify.js.map