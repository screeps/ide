"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const config_1 = require("../../config");
const ui_1 = require("../../../ui");
exports.WELCOME_URI = 'atom://screeps-ide/welcome';
class WelcomePane {
    constructor() {
        this.element = document.createElement('div');
        this.render();
    }
    render() {
        ReactDOM.render(React.createElement(ui_1.WelcomeView, { showOnStartup: config_1.configGetter('showOnStartup'), onChangeShowOnStartup: (...args) => this.onChangeShowOnStartup(...args) }), this.element);
    }
    onChangeShowOnStartup(value) {
        config_1.configSetter('showOnStartup', value);
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