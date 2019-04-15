"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Api } from '../api';
const utils_1 = require("../utils");
const state_1 = require("../state");
// @ts-ignore
async function commitAll(...args) {
    console.log('command:commitAll', ...args);
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        console.error(err);
        return;
    }
    const { branch } = state_1.default.getValue();
    if (!branch) {
        throw new Error('Need check branch');
    }
    let { modules } = await api.getUserCode(branch);
    const changes = await utils_1.readUserCode(utils_1.getBranchPath(branch));
    modules = Object.assign({}, modules, changes);
    try {
        Object.entries(state_1.default.getValue().modules)
            .forEach(([module, { deleted }]) => {
            if (deleted) {
                delete modules[module];
            }
        });
    }
    catch (err) {
        console.error('Try to delete deleted modules');
    }
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
    state_1.default.next(Object.assign({}, state_1.default.getValue(), { modules: utils_1.combineModules(modules) }));
}
exports.commitAll = commitAll;
//# sourceMappingURL=commitAll.js.map