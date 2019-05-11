"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MAIN_MODULE = 'main';
class ModulesView extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPressHandler = (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!event.target.value) {
                return;
            }
            this.props.onCreateModule && this.props.onCreateModule(event.target.value);
            event.target.value = '';
        };
        this._getAdditionalModules = (modules) => {
            return Object.entries(modules).filter(([name, { deleted }]) => {
                return name !== MAIN_MODULE && !deleted;
            });
        };
        console.log('ModulesView::constructor', props.modules);
    }
    render() {
        // console.log('ModulesView::render', '');
        return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
            React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Branch"),
                React.createElement("button", { className: 'btn btn--clear' }, this.props.branch)),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement("div", null,
                React.createElement("ul", { className: 'tab-bar screeps-modules-view__items' },
                    React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (this.props.modules[MAIN_MODULE] && this.props.modules[MAIN_MODULE].modified ? ' modified' : '') + (this.props.modules[MAIN_MODULE] && this.props.modules[MAIN_MODULE].active ? ' active' : '') },
                        React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule(MAIN_MODULE) }, MAIN_MODULE),
                        React.createElement("div", { className: 'modified-icon' })),
                    this._getAdditionalModules(this.props.modules).map(([moduleName, { modified, active }]) => {
                        return (React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (modified ? ' modified' : '') + (active ? ' active' : ''), key: moduleName },
                            React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule(moduleName) }, moduleName),
                            React.createElement("div", { className: 'close-icon', onClick: () => this.onDeleteModule(moduleName) })));
                    })),
                React.createElement("div", { className: 'screeps-modules-view__new' },
                    React.createElement("form", null,
                        React.createElement("fieldset", { className: 'screeps-field' },
                            React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'New module name...', autoComplete: '', onKeyPress: this.onKeyPressHandler }),
                            React.createElement("div", { className: 'underline' })))))));
    }
    hasChanges() {
        return Object.values(this.props.modules)
            .some(({ modified, deleted }) => !!modified || !!deleted);
    }
    onCreateModule(module) {
        this.props.onCreateModule && this.props.onCreateModule(module);
    }
    onSelectModule(module) {
        this.props.onSelectModule && this.props.onSelectModule(module);
    }
    onDeleteModule(module) {
        this.props.onDeleteModule && this.props.onDeleteModule(module);
    }
    onApplyChanges() {
        this.props.onApplyChanges && this.props.onApplyChanges();
    }
    onRevertChanges() {
        this.props.onRevertChanges && this.props.onRevertChanges();
    }
}
exports.default = ModulesView;
//# sourceMappingURL=index.js.map