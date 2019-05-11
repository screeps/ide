"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, module } }) => {
    if (type !== actions_1.DELETE_MODULE) {
        return state;
    }
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.assign({}, state.modules[branch], { [module]: {
                    deleted: true
                } }) }) });
});
//# sourceMappingURL=delete.js.map