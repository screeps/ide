import { default as store, Action } from '../../../store';
import { MODIFY_MODULE } from '../actions';

store.reducer((state: IState, { type, payload: { branch, module, modified} }: Action): IState => {
    if (type !== MODIFY_MODULE) {
        return state;
    }

    try {
        if (state.modules[branch][module].modified === modified) {
            return state;
        }
    } catch(err) {
        return state;
    }

    return {
        ...state,
        modules: {
            ...state.modules,
            [branch]: {
                ...state.modules[branch],
                [module]: {
                    ...state.modules[branch][module],
                    modified
                }
            }
        }
    };
});
