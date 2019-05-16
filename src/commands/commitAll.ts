const path = require('path');

import {
    readUserCode,
    getApi, getUser
} from '../utils';

import { configGetter } from '../config';

import { default as __state } from '../state';

export async function commitAll() {
    let api;
    try {
        api = await getApi();
        await getUser();
    } catch (err) {
        throw new Error(err);
    }

    const { branch } = __state.getValue();

    if (!branch) {
        throw new Error('Need check branch');
    }

    const projectPath = atom.project.getPaths()[0];
    const srcDir = configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);

    const modules = await readUserCode(fullPath);

    try {
        await api.updateUserCode({ branch, modules });
    } catch(err) {
        throw new Error('Error update user code');
    }
}
