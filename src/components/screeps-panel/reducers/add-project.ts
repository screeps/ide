import { default as store, Action } from '../../../store';
import { ADD_PROJECT } from '../actions';

store.reducer((state: IState, { type }: Action): IState => {
    if (type !== ADD_PROJECT) {
        return state;
    }

    return {
        ...state
    };
});
