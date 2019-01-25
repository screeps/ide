"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ModulesView extends React.Component {
    constructor(props) {
        super(props);
        this.onChooseModules = () => {
            this.setState({ isShowingBranches: false });
            this.props.onChooseModules && this.props.onChooseModules();
        };
        this.onChooseBranches = () => {
            this.setState({ isShowingBranches: true });
            this.props.onChooseBranches && this.props.onChooseBranches();
        };
        this.onSelectBranch = (branchName) => {
            this.setState({ isShowingBranches: false });
            this.props.onSelectBranch && this.props.onSelectBranch(branchName);
        };
        this.onSelectModule = (moduleName) => {
            // this.setState({ isShowingBranches: true });
            this.props.onSelectModule && this.props.onSelectModule(moduleName);
        };
        this._getAdditionalModules = (modules) => {
            return Object.keys(modules).filter((item) => {
                return item !== 'main' && modules[item];
            });
        };
        this.state = { isShowingBranches: false };
    }
    render() {
        let view;
        let header;
        if (this.state.isShowingBranches) {
            header = (React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Choose active branch:"),
                React.createElement("button", { className: 'btn icon', onClick: this.onChooseModules },
                    React.createElement("i", { className: 'sc-icon-clear' }))));
            view = (React.createElement("ul", { className: 'screeps-modules-view__branches' }, this.props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                let deleteButton;
                let sim;
                let world;
                if (!activeSim && !activeWorld) {
                    deleteButton = React.createElement("button", null,
                        React.createElement("i", { className: 'sc-icon-delete' }));
                }
                if (activeWorld) {
                    world = React.createElement("span", { className: 'screeps-modules-view__active' }, "world");
                }
                if (activeSim) {
                    sim = React.createElement("span", { className: 'screeps-modules-view__active' }, "sim");
                }
                return (React.createElement("li", { className: 'screeps-modules-view__branch', key: _id },
                    React.createElement("button", { onClick: () => this.onSelectBranch(branch) },
                        branch,
                        " ",
                        world,
                        " ",
                        sim),
                    React.createElement("button", null,
                        React.createElement("i", { className: 'sc-icon-copy' })),
                    deleteButton));
            })));
        }
        else {
            header = (React.createElement("div", { className: 'screeps-modules-view__header' },
                React.createElement("span", null, "Branch"),
                React.createElement("button", { onClick: this.onChooseBranches }, this.props.branch)));
            view = (React.createElement("div", null,
                React.createElement("ul", { className: 'screeps-modules-view__items' },
                    React.createElement("li", { className: 'screeps-modules-view__item' },
                        React.createElement("button", { onClick: () => this.onSelectModule('main') }, "main"),
                        React.createElement("button", null,
                            React.createElement("i", { className: 'sc-icon-clear' }))),
                    this._getAdditionalModules(this.props.modules).map((moduleName) => {
                        return (React.createElement("li", { className: 'screeps-modules-view__item', key: moduleName },
                            React.createElement("button", { onClick: () => this.onSelectModule(moduleName) }, moduleName),
                            React.createElement("button", null,
                                React.createElement("i", { className: 'sc-icon-clear' }))));
                    })),
                React.createElement("div", { className: 'screeps-modules-view__new' },
                    React.createElement("form", null,
                        React.createElement("fieldset", { className: 'screeps-field' },
                            React.createElement("input", { className: 'native-key-bindings', placeholder: 'New module name...', type: 'text', autoComplete: '', required: true, onChange: () => { } }),
                            React.createElement("div", { className: 'underline' }))))));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
            header,
            React.createElement("hr", { className: 'screeps-hr' }),
            view));
    }
}
exports.default = ModulesView;
//# sourceMappingURL=index.js.map