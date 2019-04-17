"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("../utils");
const state_1 = require("../state");
async function revert(event) {
    let target = event.target;
    if (target.nodeName === 'LI') {
        target = target.firstChild;
    }
    const path = target.getAttribute('data-path');
    if (!path) {
        throw new Error('No data-path');
    }
    const module = utils_1.getModuleByPath(path);
    if (!module) {
        throw new Error('Error get module');
    }
    const { modules } = state_1.default.getValue();
    const content = modules[module].content;
    const file = new atom_1.File(path);
    try {
        await file.write(content || '');
    }
    catch (err) {
        throw new Error('Error write to file');
    }
    state_1.default.next(Object.assign({}, state_1.default.getValue(), { modules: Object.assign({}, modules, { [module]: {
                content,
                modified: false
            } }) }));
}
exports.revert = revert;
//# sourceMappingURL=revert.js.map