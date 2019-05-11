"use strict";
// import { File } from 'atom';
Object.defineProperty(exports, "__esModule", { value: true });
// import {
//     getModuleByPath,
//     getApi, getUser
// } from '../utils';
// import { default as __state } from '../state';
async function commit(event) {
    console.log(event);
    // let api;
    // try {
    //     api = await getApi();
    //     await getUser();
    // } catch (err) {
    //     throw new Error(err);
    // }
    // let target: HTMLElement = event.target as HTMLElement;
    // if (target.nodeName === 'LI') {
    //     target = target.firstChild as HTMLElement;
    // }
    // const path = target.getAttribute('data-path');
    // if (!path) {
    //     throw new Error('No data-path');
    // }
    // const file = new File(path);
    // let content;
    // try {
    //     content = await file.read();
    // } catch (err) {
    //     throw new Error('Error read file');
    // }
    // const { branch } = __state.getValue();
    // if (!branch) {
    //     throw new Error('Need check branch');
    // }
    // const module = getModuleByPath(path);
    // if (!module) {
    //     throw new Error('Error get module');
    // }
    // let { modules } = await api.getUserCode(branch);
    // modules = {
    //     ...modules,
    //     [module]: content
    // };
    // try {
    //     await api.updateUserCode({ branch, modules });
    // } catch(err) {
    //     throw new Error('Error update user code');
    // }
    // const state = __state.getValue();
    // __state.next({
    //     ...state,
    //     modules: {
    //         ...state.modules,
    //         [module]: {
    //             content,
    //             modified: false
    //         }
    //     }
    // });
}
exports.commit = commit;
//# sourceMappingURL=commit.js.map