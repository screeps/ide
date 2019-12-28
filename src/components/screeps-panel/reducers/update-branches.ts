import { default as store, Action } from '../../../store';
import { UPDATE_BRANCHES } from '../actions';

store.reducer((state: IState, { type, payload: { branches } }: Action): IState => {
    if (type !== UPDATE_BRANCHES) {
        return state;
    }

    return {
        ...state,
        branches
    };
});
