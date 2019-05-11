"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
exports.INITIAL_STATE = {
    branch: '',
    branches: [],
    modules: {
        default: {}
    }
};
const __state = new rxjs_1.BehaviorSubject(exports.INITIAL_STATE);
const next = __state.next;
__state.next = function (...args) {
    // console.log(.1, 'next', ...args);
    return next.apply(this, args);
};
exports.default = __state;
//# sourceMappingURL=state.js.map