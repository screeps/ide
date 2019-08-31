"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, module, content } }) => {
    if (type !== actions_1.UPDATE_MODULE) {
        return state;
    }
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.assign({}, state.modules[branch], { [module]: Object.assign({}, state.modules[branch][module], { content }) }) }) });
});
//# sourceMappingURL=update.js.map