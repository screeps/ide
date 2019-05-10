import { default as store, Action } from '../../../store';
import { UPDATE_MODULES } from '../actions';

store.reducer((state: IState, { type, payload }: Action): IState => {
    if (type !== UPDATE_MODULES) {
        return state;
    }

    const { modules } = payload;

    return {
        ...state,
        modules: Object.entries(modules).reduce((modules, [module, content]) => {
            modules[module] = {
                content,
                modified: false
            }
            return modules;
        }, {} as any)
    };
});
