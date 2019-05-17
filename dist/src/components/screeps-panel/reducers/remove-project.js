"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
// import { REMOVE_PROJECT } from '../actions';
store_1.default.reducer((state, { type }) => {
    if (type !== 'REMOVE_PROJECT') {
        return state;
    }
    return Object.assign({}, state);
});
//# sourceMappingURL=remove-project.js.map