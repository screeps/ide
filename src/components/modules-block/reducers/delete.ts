import { default as store, Action } from '../../../store';
import { DELETE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload: { branch, module } }: Action): IState => {
    if (type !== DELETE_MODULE) {
        return state;
    }

    delete state.modules[branch][module];

    return {
        ...state,
        modules: {
            ...state.modules,
            [branch]: {
                ...state.modules[branch]
            }
        }
    };
});
