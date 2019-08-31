"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
async function updateUserCode(branch, modules) {
    if (!branch) {
        throw new Error('Need check branch');
    }
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw new Error(err);
    }
    try {
        await api.updateUserCode({ branch, modules });
    }
    catch (err) {
        throw new Error('Error update user code');
    }
}
exports.updateUserCode = updateUserCode;
//# sourceMappingURL=update-user-code.js.map