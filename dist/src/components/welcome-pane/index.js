"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const commands_1 = require("../../commands");
const config_1 = require("../../config");
const ui_1 = require("../../../ui");
const store_1 = require("../../store");
const actions_1 = require("../../store/actions");
const screeps_panel_1 = require("../screeps-panel");
exports.WELCOME_URI = 'atom://screeps-ide/welcome';
class WelcomePane {
    constructor() {
        this.element = document.createElement('div');
        this.render();
    }
    render() {
        ReactDOM.render(React.createElement(ui_1.WelcomeView, { showOnStartup: config_1.configGetter('showOnStartup'), onSignin: () => this.onSignin(), onCreateNewProject: () => this.onCreateNewProject(), onChangeShowOnStartup: (...args) => this.onChangeShowOnStartup(...args) }), this.element);
    }
    async onSignin() {
        try {
            await commands_1.authCommand();
            atom.workspace.open(screeps_panel_1.SCREEPS_URI, {
                activatePane: true,
                activateItem: true,
                // split: 'down',
                location: 'bottom'
            });
        }
        catch (err) {
            // Noop.
        }
    }
    async onCreateNewProject() {
        store_1.default.dispatch(actions_1.CreateProjectAction());
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