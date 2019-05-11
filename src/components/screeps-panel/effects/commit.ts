import { default as store, Action } from '../../../store';
import {
    UPDATE_MODULE,
    DELETE_MODULE
} from '../../modules-block/actions';

import {
    getApi, getUser
} from '../../../utils';

export const updateEffect = store
.effect(async ({ modules: _modules }: IState, { type, payload: { branch } }: Action): Promise<void> => {
    if (![UPDATE_MODULE, DELETE_MODULE].includes(type)) {
        return;
    }

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

    const modules: IModulesData = Object.entries(_modules[branch])
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
