"use strict";
// import { File } from 'atom';
Object.defineProperty(exports, "__esModule", { value: true });
async function revert(event) {
    console.log(event);
    // let target: HTMLElement = event.target as HTMLElement;
    // if (target.nodeName === 'LI') {
    //     target = target.firstChild as HTMLElement;
    // }
    // const path = target.getAttribute('data-path');
    // if (!path) {
    //     throw new Error('No data-path');
    // }
    // const module = getModuleByPath(path);
    // if (!module) {
    //     throw new Error('Error get module');
    // }
    // const { modules } = __state.getValue();
    // const content = modules[module].content;
    // const file = new File(path);
    // try {
    //     await file.write(content || '');
    // } catch (err) {
    //     throw new Error('Error write to file');
    // }
    // __state.next({
    //     ...__state.getValue(),
    //     modules: {
    //         ...modules,
    //         [module]: {
    //             content,
    //             modified: false
    //         }
    //     }
    // });
}
exports.revert = revert;
//# sourceMappingURL=revert.js.map