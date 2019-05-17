"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const store_1 = require("../../store");
require("./reducers");
const effects = require("./effects");
Object.values(effects).forEach((effect) => effect.subscribe());
const modules_view_1 = require("../../../ui/components/modules-view");
function ModulesBlock({ branch, modules }) {
    console.log(1, 'ModulesBlock', branch, modules);
    return (React.createElement(modules_view_1.default, { branch: branch, modules: modules, onCreateModule: (...args) => onCreateModule(...args), onSelectModule: (...args) => onSelectModule(...args), onDeleteModule: (...args) => onDeleteModule(...args) }));
    async function onCreateModule(module) {
        store_1.default.dispatch(actions_1.CreateModuleAction(branch, module));
        store_1.default.dispatch(actions_1.OpenTextEditorAction(branch, module));
    }
    async function onSelectModule(module) {
        store_1.default.dispatch(actions_1.OpenTextEditorAction(branch, module));
    }
    async function onDeleteModule(module) {
        store_1.default.dispatch(actions_1.DeleteModuleAction(branch, module));
    }
}
exports.ModulesBlock = ModulesBlock;
//# sourceMappingURL=index.js.map