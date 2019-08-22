import { default as store, Action } from '../../../store';
import { UPDATE_MODULES } from '../actions';

store.reducer((state: IState, { type, payload: { branch, modules } }: Action): IState => {
    if (type !== UPDATE_MODULES) {
        return state;
    }

    return {
        ...state,
        modules: {
            ...state.modules,
            [branch]: Object.entries(modules)
                .filter(([, content]) => !!content)
                .reduce((modules, [module, content]) => {
                    modules[module] = {
                        content,
                        modified: false
                    }
                    return modules;
                }, {} as any)
        }
    };
});
