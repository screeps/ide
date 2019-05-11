import { Subject, Observable } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';

import __state from '../state';

export type Action = {
    type: string;
    payload: any;
}

const store = new Subject<Action>();

function dispatch(action: Action) {
    console.log(action.type);
    store.next(action);
}

function reducer(func: Function) {
    store
        .pipe(map<Action, [IState, Action]>((action: Action) => {
            let state = __state.getValue();
            state = func(state, action);
            return [state, action];
        }))
        .pipe(distinctUntilChanged(([nState], [oState]) => nState === oState))
        .pipe(tap(([state]) => __state.next(state)))
        .subscribe();
}

function effect(func: Function): Observable<any> {
    return store
        .pipe(tap((action: Action) => {
            let state = __state.getValue();
            state = func(state, action);
        }));
}

// @ts-ignore
function pipe(callback): Observable {
    return store.pipe(callback);
}

export default {
    dispatch,
    pipe,
    reducer,
    effect
};




