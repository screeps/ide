"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ModulesView extends React.Component {
    constructor(props) {
        super(props);
        this._getAdditionalModules = (modules) => {
            return Object.keys(modules).filter((item) => {
                return item !== 'main' && modules[item];
            });
        };
        this.state = {
            isProgressing: false,
            modules: props.modules,
            branch: props.branch,
            branches: props.branches,
            isShowingBranches: false
        };
    }
    render() {
        let view;
        let header;
        if (this.state.isShowingBranches) {
            header = (React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Choose active branch:")));
            view = (React.createElement("ul", { className: 'tab-bar screeps-modules-view__items' }, this.state.branches.map(({ _id, branch, activeSim, activeWorld }) => {
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
                React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onChooseBranches() }, this.state.branch)));
            view = (React.createElement("div", null,
                React.createElement("ul", { className: 'tab-bar screeps-modules-view__items' },
                    React.createElement("li", { className: 'tab screeps-modules-view__item' },
                        React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule('main') }, "main")),
                    this._getAdditionalModules(this.state.modules).map((moduleName) => {
                        return (React.createElement("li", { className: 'tab screeps-modules-view__item', key: moduleName },
                            React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectModule(moduleName) }, moduleName),
                            React.createElement("div", { className: 'close-icon' })));
                    }))));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
            header,
            React.createElement("hr", { className: 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') }),
            view));
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
}
exports.default = ModulesView;
//# sourceMappingURL=index.js.map