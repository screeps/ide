"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const store_1 = require("../../../store");
const actions_1 = require("../actions");
const utils_1 = require("../../../utils");
exports.deleteEffect = store_1.default
    .effect((state, { type, payload: { branch, module } }) => {
    state;
    if (type !== actions_1.DELETE_MODULE) {
        return;
    }
    const modulePath = utils_1.getModulePath(branch, module);
    try {
        fs.unlink(modulePath, () => { });
    }
    catch (err) {
        // Noop.
    }
});
//# sourceMappingURL=delete.js.map