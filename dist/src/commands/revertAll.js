"use strict";
// import { File } from 'atom';
Object.defineProperty(exports, "__esModule", { value: true });
async function revertAll() {
    // let api;
    // try {
    //     api = await getApi();
    //     await getUser();
    // } catch (err) {
    //     throw new Error(err);
    // }
    // const { branch } = __state.getValue();
    // if (!branch) {
    //     throw new Error('Need check branch');
    // }
    // const { modules: _modules } = await api.getUserCode(branch);
    // const changes = await readUserCode(getBranchPath(branch));
    // const modules = combineModules({
    //     ...changes,
    //     ..._modules
    // }, changes);
    // const entries = Object.entries(modules);
    // for(let i = 0, l = entries.length; i < l; i++) {
    //     const [module, { content, modified, deleted }] = entries[i];
    //     if (!modified && !deleted) {
    //         continue;
    //     }
    //     const modulePath = getModulePath(branch, module);
    //     const moduleFile = new File(modulePath);
    //     try {
    //         await moduleFile.write(content || '');
    //     } catch (err) {
    //         // Noop.
    //     }
    //     modules[module] = {
    //         content,
    //         modified: false
    //     };
    // }
    // __state.next({
    //     ...__state.getValue(),
    //     modules
    // });
}
exports.revertAll = revertAll;
//# sourceMappingURL=revertAll.js.map