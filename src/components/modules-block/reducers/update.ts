import { default as store, Action } from '../../../store';
import { UPDATE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload }: Action): IState => {
    if (type !== UPDATE_MODULE) {
        return state;
    }

    const { module, content } = payload;

    return {
        ...state,
        modules: {
            ...state.modules,
            [module]: {
                content
            }
        }
    };
});
