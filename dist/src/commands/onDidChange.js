"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const state_1 = require("../state");
const utils_1 = require("../utils");
async function onDidChange({ path }) {
    const module = utils_1.getModuleByPath(path);
    if (!module) {
        throw 'Error get module';
    }
    console.log(module);
    const file = new atom_1.File(path);
    let content;
    try {
        content = await file.read();
    }
    catch (err) {
        throw 'Error read file';
        ;
    }
    const { modules } = state_1.default.getValue();
    if (!modules) {
        throw 'Error read modules';
        ;
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
//# sourceMappingURL=onDidChange.js.map