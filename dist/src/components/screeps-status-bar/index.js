"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
class ScreepsStatusBar {
    constructor(_state) {
        this._state = _state;
        this.element = document.createElement('div');
        this.element.classList.add('screeps-ide__status-bar', 'screeps-ide__status-bar--screeps', 'inline-block');
        this.render(this._state.getValue());
    }
    render({ branch }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement("b", { className: 'sc-icon-screeps' }),
            React.createElement("i", null, branch)), this.element);
    }
}
exports.ScreepsStatusBar = ScreepsStatusBar;
//# sourceMappingURL=index.js.map