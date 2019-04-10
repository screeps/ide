"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DEFAULT_BRANCH = 'default';
const VIEW_SELECT = 'SELECT';
const VIEW_CREATE = 'CREATE';
class BranchesView extends React.Component {
    constructor(props) {
        super(props);
        this._inputRef = React.createRef();
        this.state = {
            branch: props.branch || DEFAULT_BRANCH,
            view: VIEW_SELECT
        };
    }
    render() {
        let control;
        if (this.state.view === VIEW_SELECT) {
            control = (React.createElement("select", { className: 'input-select', value: this.state.branch, onChange: (event) => this.onBranch(event) }, this.props.branches.map(({ _id, branch }) => {
                return (React.createElement("option", { key: _id, value: branch }, branch));
            })));
        }
        else {
            control = (
            // @ts-ignore
            React.createElement("atom-text-editor", { mini: true, ref: this._inputRef }));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-branches-view' },
            React.createElement("i", { className: 'sc-icon-screeps' }),
            control,
            React.createElement("button", { className: 'btn', onClick: () => this.newBranch() }, "New Branch")));
    }
    newBranch() {
        if (this.state.view === VIEW_SELECT) {
            this.state.view = VIEW_CREATE;
            this.setState(Object.assign({}, this.state));
            return;
        }
        // @ts-ignore
        console.log(this._inputRef.current.getModel().getText());
    }
    onBranch(event) {
        this.props.onBranch && this.props.onBranch(event.target.value);
    }
}
exports.default = BranchesView;
//# sourceMappingURL=index.js.map