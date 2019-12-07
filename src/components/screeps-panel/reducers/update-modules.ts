import { default as store, Action } from '../../../store';
import { UPDATE_MODULES } from '../actions';

store.reducer((state: IState, { type, payload: { branch, modules } }: Action): IState => {
    if (type !== UPDATE_MODULES) {
        return state;
    }

    const modules1 = Object.entries(state.modules[branch] || {})
        .filter(([, { isNew }]) => isNew)
        .reduce((modules, [module, { isNew, modified }]) => {
            modules[module] = {
                isNew,
                modified
            };

            return modules;
        }, {} as any)

    const modules2 = Object.entries(modules)
        .filter(([, content]) => !!content)
        .reduce((modules, [module, content]) => {
            modules[module] = {
                content,
                modified: false
            };

            return modules;
        }, {} as any)

    return {
        ...state,
        modules: {
            ...state.modules,
            [branch]: {
                ...modules1,
                ...modules2
            }
        }
    };
});
