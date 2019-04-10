"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DEFAULT_BRANCH = 'default';
class BranchesView extends React.Component {
    constructor(props) {
        super(props);
        this._inputRef = React.createRef();
        this.state = {
            branch: props.branch || DEFAULT_BRANCH
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-branches-view' },
            React.createElement("i", { className: 'sc-icon-screeps' }),
            React.createElement("select", { className: 'input-select', value: this.state.branch, onChange: (event) => this.onBranch(event) }, this.props.branches.map(({ _id, branch }) => {
                return (React.createElement("option", { key: _id, value: branch }, branch));
            })),
            React.createElement("button", { className: 'btn', onClick: () => this.onCopyBranch(this.state.branch) }, "Copy Branch")));
    }
    onBranch(event) {
        this.props.onBranch && this.props.onBranch(event.target.value);
    }
    onCopyBranch(branch) {
        this.props.onCopyBranch && this.props.onCopyBranch(branch);
    }
}
exports.default = BranchesView;
//# sourceMappingURL=index.js.map