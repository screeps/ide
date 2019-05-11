"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../../modules-block/actions");
const utils_1 = require("../../../utils");
exports.updateEffect = store_1.default
    .effect(async ({ modules: _modules }, { type, payload: { branch } }) => {
    if (![actions_1.UPDATE_MODULE, actions_1.DELETE_MODULE].includes(type)) {
        return;
    }
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    if (!branch) {
        throw new Error('Need check branch');
    }
    const modules = Object.entries(_modules[branch])
        .reduce((modules, [module, { content, deleted }]) => {
        if (!deleted) {
            modules[module] = content;
        }
        return modules;
    }, {});
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
});
//# sourceMappingURL=commit.js.map