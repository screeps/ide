"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, modules } }) => {
    if (type !== actions_1.UPDATE_MODULES) {
        return state;
    }
    const modules1 = Object.entries(state.modules[branch])
        .filter(([, { isNew }]) => isNew)
        .reduce((modules, [module, { isNew, modified }]) => {
        modules[module] = {
            isNew,
            modified
        };
        return modules;
    }, {});
    const modules2 = Object.entries(modules)
        .filter(([, content]) => !!content)
        .reduce((modules, [module, content]) => {
        modules[module] = {
            content,
            modified: false
        };
        return modules;
    }, {});
    // Object.entries(modules2).forEach(() => {
    // })
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.assign({}, modules1, modules2) }) });
});
//# sourceMappingURL=update.js.map