"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const confirm_modal_1 = require("../confirm-modal");
const store_1 = require("../../store");
require("./reducers");
const effects = require("./effects");
Object.values(effects).forEach((effect) => effect.subscribe());
const modules_view_1 = require("../../../ui/components/modules-view");
function ModulesBlock(props) {
    return (React.createElement(modules_view_1.default, { branch: props.branch, modules: props.modules, active: props.active, onCreateModule: (...args) => onCreateModule(...args), onSelectModule: (...args) => onSelectModule(...args), onDeleteModule: (...args) => onDeleteModule(...args) }));
    async function onCreateModule(module) {
        store_1.default.dispatch(actions_1.CreateModuleAction(props.branch, module));
        store_1.default.dispatch(actions_1.OpenTextEditorAction(props.branch, module));
    }
    async function onSelectModule(module) {
        store_1.default.dispatch(actions_1.OpenTextEditorAction(props.branch, module));
    }
    async function onDeleteModule(module) {
        try {
            await confirm_modal_1.default({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });
        }
        catch (err) {
            return;
        }
        store_1.default.dispatch(actions_1.DeleteModuleAction(props.branch, module));
    }
}
exports.ModulesBlock = ModulesBlock;
//# sourceMappingURL=index.js.map