"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../../store");
const actions_1 = require("../actions");
function generateContent(module) {
    return `/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('${module}');
* mod.thing == 'a thing'; // true
*/

module.exports = {

};
`;
}
store_1.default.reducer((state, { type, payload: { branch, module } }) => {
    if (type !== actions_1.CREATE_MODULE) {
        return state;
    }
    const content = generateContent(module);
    return Object.assign({}, state, { modules: Object.assign({}, state.modules, { [branch]: Object.assign({}, state.modules[branch], { [module]: {
                    content,
                    isNew: true,
                    modified: true
                } }) }) });
});
//# sourceMappingURL=create.js.map