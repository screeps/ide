// import {
//     getApi, getUser
// } from '../utils';

import { default as __state } from '../state';

export async function commitAll() {
    // let api;
    // try {
    //     api = await getApi();
    //     await getUser();
    // } catch (err) {
    //     throw new Error(err);
    // }

    // const { branch, modules: _modules } = __state.getValue();

    // if (!branch) {
    //     throw new Error('Need check branch');
    // }

    // const modules: IModulesData = Object.entries(_modules)
    //     .reduce((modules, [module, { content, deleted }]) => {
    //         if (!deleted) {
    //             modules[module] = content;
    //         }

    //         return modules;
    //     }, {} as IModulesData);

    // try {
    //     await api.updateUserCode({ branch, modules });
    // } catch(err) {
    //     throw new Error('Error update user code');
    // }
}
