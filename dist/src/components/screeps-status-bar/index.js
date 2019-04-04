"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
const utils_1 = require("../../utils");
class ScreepsStatusBar {
    constructor(_state) {
        this._state = _state;
        this.element = document.createElement('div');
        this._tooltip = document.createElement('div');
        this.branchedVewRef = React.createRef();
        this.element.classList.add('screeps-ide__status-bar', 'screeps-ide__status-bar--screeps', 'inline-block');
        atom.tooltips.add(this.element, {
            item: this._tooltip,
            trigger: 'click',
            class: 'screeps-ide__tooltip'
        });
        this.render(_state.getValue());
    }
    render({ branch } = { branch: '' }) {
        ReactDOM.render(React.createElement("div", { onClick: () => this.tooltip() },
            React.createElement("b", { className: 'sc-icon-screeps' }),
            React.createElement("i", null, branch)), this.element);
    }
    tooltip() {
        (async () => {
            try {
                const _api = await utils_1.getApi();
                await utils_1.getUser();
                const { list: branches } = await _api.getUserBranches();
                const branch = this._state.getValue().branch;
                // TODO: check destroy instance of React.Component
                ReactDOM.render(React.createElement(ui_1.BranchesView, { ref: this.branchedVewRef, branch: branch, branches: branches, onBranch: (...args) => this.onBranch(...args) }), this._tooltip);
            }
            catch (err) {
            }
        })();
    }
    onBranch(branch) {
        if (!this.branchedVewRef.current) {
            return;
        }
        this.branchedVewRef.current.setState(Object.assign({}, this.branchedVewRef.current.state, { branch }));
        this._state.next(Object.assign({}, this._state.getValue(), { branch }));
    }
}
exports.ScreepsStatusBar = ScreepsStatusBar;
//# sourceMappingURL=index.js.map