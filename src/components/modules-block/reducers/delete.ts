import { default as store, Action } from '../../../store';
import { DELETE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload }: Action): IState => {
    if (type !== DELETE_MODULE) {
        return state;
    }

    const { module } = payload;

    return {
        ...state,
        modules: {
            ...state.modules,
            [module]: {
                deleted: true
            }
        }
    };
});
