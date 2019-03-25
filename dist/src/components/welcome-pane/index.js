"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
exports.WELCOME_URI = 'atom://screeps-ide/welcome';
class WelcomePane {
    constructor() {
        this.element = document.createElement('div');
        this.render();
    }
    render() {
        ReactDOM.render(React.createElement(ui_1.WelcomeView, null), this.element);
    }
    // Atom pane required interface's methods
    getURI() {
        return exports.WELCOME_URI;
    }
    getTitle() {
        return 'Welcome to Screeps';
    }
}
exports.WelcomePane = WelcomePane;
//# sourceMappingURL=index.js.map