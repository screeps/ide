"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("../utils");
const state_1 = require("../state");
async function revertAll() {
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    const { branch } = state_1.default.getValue();
    if (!branch) {
        throw new Error('Need check branch');
    }
    const { modules: _modules } = await api.getUserCode(branch);
    const changes = await utils_1.readUserCode(utils_1.getBranchPath(branch));
    const modules = utils_1.combineModules(Object.assign({}, changes, _modules), changes);
    const entries = Object.entries(modules);
    for (let i = 0, l = entries.length; i < l; i++) {
        const [module, { content, modified, deleted }] = entries[i];
        if (!modified && !deleted) {
            continue;
        }
        const modulePath = utils_1.getModulePath(branch, module);
        const moduleFile = new atom_1.File(modulePath);
        try {
            await moduleFile.write(content || '');
        }
        catch (err) {
            // Noop.
        }
        modules[module] = {
            content,
            modified: false
        };
    }
    state_1.default.next(Object.assign({}, state_1.default.getValue(), { modules }));
}
exports.revertAll = revertAll;
//# sourceMappingURL=revertAll.js.map