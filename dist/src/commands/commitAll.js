"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const utils_1 = require("../utils");
const config_1 = require("../config");
const state_1 = require("../state");
async function commitAll() {
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
    const projectPath = atom.project.getPaths()[0];
    const srcDir = config_1.configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);
    const modules = await utils_1.readUserCode(fullPath);
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
}
exports.commitAll = commitAll;
//# sourceMappingURL=commitAll.js.map