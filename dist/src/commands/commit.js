"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("../utils");
const state_1 = require("../state");
// @ts-ignore
async function commit(event) {
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    let target = event.target;
    if (target.nodeName === 'LI') {
        target = target.firstChild;
    }
    const path = target.getAttribute('data-path');
    if (!path) {
        throw new Error('No data-path');
    }
    const file = new atom_1.File(path);
    let content;
    try {
        content = await file.read();
    }
    catch (err) {
        throw new Error('Error read file');
    }
    const { branch } = state_1.default.getValue();
    if (!branch) {
        throw new Error('Need check branch');
    }
    const module = utils_1.getModuleByPath(path);
    if (!module) {
        throw new Error('Error get module');
    }
    let { modules } = await api.getUserCode(branch);
    modules = Object.assign({}, modules, { [module]: content });
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
    const state = state_1.default.getValue();
    state_1.default.next(Object.assign({}, state, { modules: Object.assign({}, state.modules, { [module]: {
                content,
                modified: false
            } }) }));
}
exports.commit = commit;
//# sourceMappingURL=commit.js.map