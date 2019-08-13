"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, module, modified } }) => {
    if (type !== actions_1.MODIFY_MODULE) {
        return state;
    }
    try {
        if (state.modules[branch][module].modified === modified) {
            return state;
        }
    }
    catch (err) {
        return state;
    }
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.assign({}, state.modules[branch], { [module]: Object.assign({}, state.modules[branch][module], { modified }) }) }) });
});
//# sourceMappingURL=modify.js.map