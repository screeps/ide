import { default as store, Action } from '../../../store';
import { SET_ACTIVE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload: { branch, module } }: Action): IState => {
    if (type !== SET_ACTIVE_MODULE) {
        return state;
    }

    return {
        ...state,
        activeBranchTextEditor: branch,
        activeModuleTextEditor: module
    };
});
