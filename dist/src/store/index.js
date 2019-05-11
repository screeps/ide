"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const state_1 = require("../state");
const store = new rxjs_1.Subject();
function dispatch(action) {
    console.log(action.type);
    store.next(action);
}
function reducer(func) {
    store
        .pipe(operators_1.map((action) => {
        let state = state_1.default.getValue();
        state = func(state, action);
        return [state, action];
    }))
        .pipe(operators_1.distinctUntilChanged(([nState], [oState]) => nState === oState))
        .pipe(operators_1.tap(([state]) => state_1.default.next(state)))
        .subscribe();
}
function effect(func) {
    return store
        .pipe(operators_1.tap((action) => {
        let state = state_1.default.getValue();
        state = func(state, action);
    }));
}
// @ts-ignore
function pipe(callback) {
    return store.pipe(callback);
}
exports.default = {
    dispatch,
    pipe,
    reducer,
    effect
};
//# sourceMappingURL=index.js.map