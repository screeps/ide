import __state from '../state';

import {
    getApi, getUser
} from '../utils';

export async function updateUserCode(
    branch: string,
    modules: IModulesData
): Promise<any> {
    if (!branch) {
        throw new Error('Need check branch');
    }

    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
    }

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }
}
