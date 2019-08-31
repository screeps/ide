"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_ACTIVE_MODULE = 'SET_ACTIVE_MODULE';
function SetActiveModule(branch, module) {
    return {
        type: exports.SET_ACTIVE_MODULE,
        payload: {
            branch,
            module
        }
    };
}
exports.SetActiveModule = SetActiveModule;
//# sourceMappingURL=set-active-module.js.map