import { default as store, Action } from '../../../store';
import { UPDATE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload: { branch, module, content } }: Action): IState => {
    if (type !== UPDATE_MODULE) {
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
                    content
                }
            }
        }
    };
});
