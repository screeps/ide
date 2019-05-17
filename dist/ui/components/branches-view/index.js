"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class BranchesView extends React.Component {
    constructor(props) {
        // console.log('BranchesView::constructor', '');
        super(props);
    }
    render() {
        // console.log('BranchesView::render', '');
        return (React.createElement("div", { className: 'screeps-ide screeps-branches-view' },
            React.createElement("div", { className: 'screeps-branches-view__header' },
                React.createElement("span", null, "Branches")),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement("ul", { className: 'tab-bar screeps-branches-view__items' }, this.props.branches && this.props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                let deleteButton;
                let sim;
                let world;
                if (!activeSim && !activeWorld) {
                    deleteButton = React.createElement("div", { className: 'close-icon', onClick: () => this.onDeleteBranch(branch) });
                }
                if (activeWorld) {
                    world = (React.createElement("button", { className: 'screeps-branches-view__world --active' }, "world"));
                }
                else {
                    world = (React.createElement("button", { className: 'screeps-branches-view__world', onClick: () => this.onSetActiveWorld(branch) }, "world"));
                }
                if (activeSim) {
                    sim = (React.createElement("button", { className: 'screeps-branches-view__sim --active' }, "sim"));
                }
                else {
                    sim = (React.createElement("button", { className: 'screeps-branches-view__sim', onClick: () => this.onSetActiveSim(branch) }, "sim"));
                }
                return (React.createElement("li", { className: 'tab screeps-branches-view__item', key: _id },
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onCopyBranch(branch) },
                        React.createElement("i", { className: 'sc-icon-copy' })),
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => this.onSelectBranch(branch) }, branch),
                    world,
                    " ",
                    sim,
                    deleteButton));
            }))));
    }
    onCopyBranch(branch) {
        this.props.onCopyBranch && this.props.onCopyBranch(branch);
    }
    onSelectBranch(branch) {
        this.props.onSelectBranch && this.props.onSelectBranch(branch);
    }
    onDeleteBranch(branch) {
        this.props.onDeleteBranch && this.props.onDeleteBranch(branch);
    }
    onSetActiveSim(branch) {
        this.props.onSetActiveSim && this.props.onSetActiveSim(branch);
    }
    onSetActiveWorld(branch) {
        this.props.onSetActiveWorld && this.props.onSetActiveWorld(branch);
    }
}
exports.default = BranchesView;
//# sourceMappingURL=index.js.map