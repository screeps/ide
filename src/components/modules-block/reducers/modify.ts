import { default as store, Action } from '../../../store';
import { MODIFY_MODULE } from '../actions';

store.reducer((state: IState, { type, payload: { module, modified} }: Action): IState => {
    if (type !== MODIFY_MODULE) {
        return state;
    }

    if (state.modules[module].modified === modified) {
        return state;
    }

    return {
        ...state,
        modules: {
            ...state.modules,
            [module]: {
                ...state.modules[module],
                modified
            }
        }
    };
});
