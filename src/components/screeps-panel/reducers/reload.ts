import { default as store, Action } from '../../../store';
import { RELOAD_STATE } from '../actions';

store.reducer((state: IState, { type }: Action): IState => {
    if (type !== RELOAD_STATE) {
        return state;
    }

    return {
        ...state
    };
});
