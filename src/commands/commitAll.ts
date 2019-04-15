// import { Api } from '../api';
import {
    getBranchPath, 
    readUserCode,
    getApi, getUser,
    combineModules
} from '../utils';

import { default as __state } from '../state';

// @ts-ignore
export async function commitAll(...args) {
    console.log('command:commitAll', ...args);

    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        console.error(err);
        return;
    }

    const { branch } = __state.getValue();

    if (!branch) {
        throw new Error('Need check branch');
    }

    let { modules } = await api.getUserCode(branch);

    const changes = await readUserCode(getBranchPath(branch));

    modules = {
        ...modules,
        ...changes
    };

    try {
        Object.entries(__state.getValue().modules)
            .forEach(([module, { deleted }]) => {
                if (deleted) {
                    delete modules[module];
                }
            });
    } catch(err) {
        console.error('Try to delete deleted modules');
    }

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }

    __state.next({
        ...__state.getValue(),
        modules: combineModules(modules)
    });

}
