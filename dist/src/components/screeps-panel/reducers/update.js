"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type, payload: { branch, modules } }) => {
    if (type !== actions_1.UPDATE_MODULES) {
        return state;
    }
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.entries(modules)
                .filter(([, content]) => !!content)
                .reduce((modules, [module, content]) => {
                modules[module] = {
                    content,
                    modified: false
                };
                return modules;
            }, {}) }) });
});
//# sourceMappingURL=update.js.map