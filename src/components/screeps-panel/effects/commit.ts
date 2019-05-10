import { default as store, Action } from '../../../store';
import {
    UPDATE_MODULE,
    DELETE_MODULE
} from '../../modules-block/actions';

import {
    getApi, getUser
} from '../../../utils';

export const updateEffect = store
.effect(async ({ branch, modules: _modules }: IState, { type }: Action): Promise<void> => {
    if (![UPDATE_MODULE, DELETE_MODULE].includes(type)) {
        return;
    }

    console.log('commit');

    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
    }

    if (!branch) {
        throw new Error('Need check branch');
    }

    const modules: IModulesData = Object.entries(_modules)
        .reduce((modules, [module, { content, deleted }]) => {
            if (!deleted) {
                modules[module] = content;
            }

            return modules;
        }, {} as IModulesData);

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }
});
