"use strict";
// import { File } from 'atom';
Object.defineProperty(exports, "__esModule", { value: true });
// import { default as __state } from '../state';
// export async function onDidChange(path: string, module: string): Promise<IModule> {
async function onDidChange(path, module) {
    console.log(path, module);
    // const file = new File(path);
    // let content;
    // try {
    //     content = await file.read();
    // } catch (err) {
    //     throw new Error(err);
    // }
    // const { modules } = __state.getValue();
    // if (!modules) {
    //     throw new Error('Error read modules');
    // }
    // let _module = modules[module];
    // _module = {
    //     content: _module && _module.content || null,
    //     modified: _module && _module.content !== content || false,
    //     deleted: _module && _module.deleted || false
    // }
    // __state.next({
    //     ...__state.getValue(),
    //     modules: {
    //         ...modules,
    //         [module]: _module
    //     }
    // });
    // return _module;
}
exports.onDidChange = onDidChange;
//# sourceMappingURL=on-did-change.js.map