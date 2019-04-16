import { File } from 'atom';

import {
    getModulePath,
    getBranchPath,
    readUserCode,
    getApi, getUser,
    combineModules
} from '../utils';

import { default as __state } from '../state';

// @ts-ignore
export async function revertAll(...args) {
    console.log('command:revertAll', ...args);

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

    const { modules: _modules } = await api.getUserCode(branch);

    const changes = await readUserCode(getBranchPath(branch));

    const modules = combineModules({
        ...changes,
        ..._modules
    }, changes);

    const entries = Object.entries(modules);

    for(let i = 0, l = entries.length; i < l; i++) {
        const [module, { content, modified, deleted }] = entries[i];

        if (!modified && !deleted) {
            continue;
        }

        const modulePath = getModulePath(branch, module);
        const moduleFile = new File(modulePath);

        try {
            await moduleFile.write(content || '');
        } catch (err) {
            // Noop.
        }

        modules[module] = {
            content,
            modified: false
        };
    }

    __state.next({
        ...__state.getValue(),
        modules
    });
}
