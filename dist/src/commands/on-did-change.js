"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const state_1 = require("../state");
async function onDidChange(path, module) {
    const file = new atom_1.File(path);
    let content;
    try {
        content = await file.read();
    }
    catch (err) {
        throw new Error(err);
    }
    const { modules } = state_1.default.getValue();
    if (!modules) {
        throw new Error('Error read modules');
    }
    let _module = modules[module];
    _module = {
        content: _module && _module.content || null,
        modified: _module && _module.content !== content || false,
        deleted: _module && _module.deleted || false
    };
    state_1.default.next(Object.assign({}, state_1.default.getValue(), { modules: Object.assign({}, modules, { [module]: _module }) }));
    return _module;
}
exports.onDidChange = onDidChange;
//# sourceMappingURL=on-did-change.js.map