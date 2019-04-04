"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const console_panel_1 = require("../console-panel");
class ConsoleStatusBar {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('screeps-ide__status-bar', 'screeps-ide__status-bar--console', 'inline-block');
        this.element.addEventListener('click', () => this.onClick());
        this.render();
    }
    render() {
        ReactDOM.render(React.createElement("div", null,
            React.createElement("b", { className: 'sc-icon-screeps' }),
            React.createElement("i", null, "default")), this.element);
    }
    onClick() {
        atom.workspace.open(console_panel_1.CONSOLE_URI, {
            activatePane: true,
            activateItem: true,
            // split: 'down',
            location: 'bottom'
        });
    }
}
exports.ConsoleStatusBar = ConsoleStatusBar;
//# sourceMappingURL=index.js.map