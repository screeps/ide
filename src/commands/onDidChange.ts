import { File } from 'atom';

import { default as __state } from '../state';

import { getModuleByPath } from '../utils';

export async function onDidChange({ path }: { path: string }): Promise<IModule> {
    const module = getModuleByPath(path);

    if (!module) {
        throw new Error('Error get module');
    }

    const file = new File(path);

    let content;
    try {
        content = await file.read();
    } catch (err) {
        throw new Error('Error read file');
    }

    const { modules } = __state.getValue();

    if (!modules) {
        throw new Error('Error read modules');
    }

    let _module = modules[module];

    _module = {
        content: _module && _module.content || null,
        modified: _module && _module.content !== content || false,
        deleted: _module && _module.deleted || false
    }

    __state.next({
        ...__state.getValue(),
        modules: {
            ...modules,
            [module]: _module
        }
    });

    return _module;
}