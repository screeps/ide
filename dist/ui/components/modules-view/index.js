"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MAIN_MODULE = 'main';
class ModulesView extends React.Component {
    constructor(props) {
        super(props);
        this._getAdditionalModules = (modules) => {
            return Object.entries(modules).filter(([name, { content }]) => {
                return name !== MAIN_MODULE && content;
            });
        };
        this.state = {
            isProgressing: false,
            modules: props.modules,
            branch: props.branch,
            branches: props.branches || [],
            isShowingBranches: false
        };
    }
    render() {
        let view;
        let header;
        if (this.state.isShowingBranches) {
            header = (React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Choose active branch:")));
            view = (React.createElement("ul", { className: 'tab-bar screeps-modules-view__items' }, this.state.branches && this.state.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                let deleteButton;
                let sim;
                let world;
                if (!activeSim && !activeWorld) {
                    deleteButton = React.createElement("div", { className: 'close-icon', onClick: () => this.onDeleteBranch(branch) });
                }
                if (activeWorld) {
                    world = React.createElement("span", { className: 'screeps-modules-view__active' }, "world");
                }
                if (activeSim) {
                    sim = React.createElement("span", { className: 'screeps-modules-view__active' }, "sim");
                }
                return (React.createElement("li", { className: 'tab screeps-modules-view__item', key: _id },
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onCopyBranch(branch) },
                        React.createElement("i", { className: 'sc-icon-copy' })),
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectBranch(branch) }, branch),
                    world,
                    " ",
                    sim,
                    deleteButton));
            })));
        }
        else {
            header = (React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Branch"),
                React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onChooseBranches() }, this.state.branch),
                React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onApplyChanges(), disabled: !this.hasChanges() },
                    React.createElement("i", { className: 'sc-icon-done' })),
                React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onRevertChanges(), disabled: !this.hasChanges() },
                    React.createElement("i", { className: 'sc-icon-revert' }))));
            view = (React.createElement("div", null,
                React.createElement("ul", { className: 'tab-bar screeps-modules-view__items' },
                    React.createElement("li", { className: 'tab screeps-modules-view__item' + (this.state.modules[MAIN_MODULE] && this.state.modules[MAIN_MODULE].modified ? ' modified' : '') },
                        React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule(MAIN_MODULE) }, MAIN_MODULE),
                        React.createElement("div", { className: 'modified-icon' })),
                    this._getAdditionalModules(this.state.modules).map(([moduleName, { modified }]) => {
                        return (React.createElement("li", { className: 'tab screeps-modules-view__item' + (modified ? ' modified' : ''), key: moduleName },
                            React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule(moduleName) }, moduleName),
                            React.createElement("div", { className: 'close-icon', onClick: () => this.onDeleteModule(moduleName) })));
                    })),
                React.createElement("div", { className: 'screeps-modules-view__new' },
                    React.createElement("form", null,
                        React.createElement("fieldset", { className: 'screeps-field' },
                            React.createElement("input", { className: 'native-key-bindings', placeholder: 'New module name...', type: 'text', autoComplete: '', required: true, onChange: () => { } }),
                            React.createElement("div", { className: 'underline' }))))));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
            header,
            React.createElement("hr", { className: 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') }),
            view));
    }
    hasChanges() {
        return Object.values(this.state.modules).some(({ modified }) => !!modified);
    }
    onChooseModules() {
        this.state.isShowingBranches = false;
        this.setState(Object.assign({}, this.state));
        this.props.onChooseModules && this.props.onChooseModules();
    }
    onChooseBranches() {
        this.state.isShowingBranches = true;
        this.setState(Object.assign({}, this.state));
        this.props.onChooseBranches && this.props.onChooseBranches();
    }
    onCopyBranch(branch) {
        this.props.onCopyBranch && this.props.onCopyBranch(branch);
    }
    onSelectBranch(branch) {
        this.state.isShowingBranches = false;
        this.state.modules = {};
        this.setState(Object.assign({}, this.state, { branch }));
        this.props.onSelectBranch && this.props.onSelectBranch(branch);
    }
    onDeleteBranch(branch) {
        this.props.onDeleteBranch && this.props.onDeleteBranch(branch);
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