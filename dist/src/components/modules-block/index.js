"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const actions_1 = require("./actions");
const confirm_modal_1 = require("../confirm-modal");
const store_1 = require("../../store");
const state_1 = require("../../state");
require("./reducers");
const effects = require("./effects");
Object.values(effects).forEach((effect) => effect.subscribe());
const modules_view_1 = require("../../../ui/components/modules-view");
const actions_2 = require("../../actions");
function ModulesBlock(props) {
    return (React.createElement(modules_view_1.default, { branch: props.branch, modules: props.modules, active: props.active, onCreateModule: (...args) => onCreateModule(...args), onSelectModule: (...args) => onSelectModule(...args), onDeleteModule: (...args) => onDeleteModule(...args) }));
    async function onCreateModule(module) {
        store_1.default.dispatch(actions_1.CreateModuleAction(props.branch, module));
        store_1.default.dispatch(actions_1.OpenTextEditorAction(props.branch, module));
    }
    async function onSelectModule(module, textEditorPending) {
        store_1.default.dispatch(actions_1.OpenTextEditorAction(props.branch, module, textEditorPending));
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
        const modules = state_1.selectModules(props.branch);
        delete modules[module];
        await actions_2.updateUserCode(props.branch, modules);
        store_1.default.dispatch(actions_1.DeleteModuleAction(props.branch, module));
    }
}
exports.ModulesBlock = ModulesBlock;
//# sourceMappingURL=index.js.map