"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, module } }) => {
    if (type !== actions_1.SET_ACTIVE_MODULE) {
        return state;
    }
    return Object.assign({}, state, { activeBranchTextEditor: branch, activeModuleTextEditor: module });
});
//# sourceMappingURL=set-active-module.js.map