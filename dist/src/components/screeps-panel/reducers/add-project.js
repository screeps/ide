"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
store_1.default.reducer((state, { type }) => {
    if (type !== actions_1.ADD_PROJECT) {
        return state;
    }
    return Object.assign({}, state);
});
//# sourceMappingURL=add-project.js.map