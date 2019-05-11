"use strict";
// import {
//     getBranchPath, 
//     readUserCode,
//     getApi, getUser,
//     combineModules
// } from '../utils';
// import { default as __state } from '../state';
// export async function commitAll() {
//     let api;
//     try {
//         api = await getApi();
//         await getUser();
//     } catch (err) {
//         throw new Error(err);
//     }
//     const { branch } = __state.getValue();
//     if (!branch) {
//         throw new Error('Need check branch');
//     }
//     let { modules } = await api.getUserCode(branch);
//     const changes = await readUserCode(getBranchPath(branch));
//     modules = {
//         ...modules,
//         ...changes
//     };
//     try {
//         Object.entries(__state.getValue().modules)
//             .forEach(([module, { deleted }]) => {
//                 if (deleted) {
//                     delete modules[module];
//                 }
//             });
//     } catch(err) {
//         throw new Error(err);
//     }
//     try {
//         await api.updateUserCode({ branch, modules });
//     } catch(err) {
//         throw new Error('Error update user code');
//     }
//     __state.next({
//         ...__state.getValue(),
//         modules: combineModules(modules)
//     });
// }
//# sourceMappingURL=__commitAll.js.map