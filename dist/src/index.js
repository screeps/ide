"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const state_1 = require("./state");
const config_1 = require("./config");
const commands_1 = require("./commands");
const welcome_pane_1 = require("./components/welcome-pane");
const modules_pane_1 = require("./components/modules-pane");
const console_panel_1 = require("./components/console-panel");
const memory_panel_1 = require("./components/memory-panel");
// import { ModulesPane, MODULES_URI } from './components/modules-pane';
const subscriptions = new atom_1.CompositeDisposable();
var config_2 = require("./config");
exports.config = config_2.default;
tslib_1.__exportStar(require("./consumed-services"), exports);
function initialize(state) {
    console.log('Screeps-IDE:initialize', state);
    state_1.default.next(state);
}
exports.initialize = initialize;
function activate(state) {
    console.log('Screeps-IDE:activate', state);
    subscriptions.add(atom.workspace.addOpener((uri) => {
        if (uri === modules_pane_1.MODULES_URI) {
            return new modules_pane_1.ModulesPane();
        }
    }));
    subscriptions.add(atom.workspace.addOpener((uri) => {
        if (uri === console_panel_1.CONSOLE_URI) {
            return new console_panel_1.ConsolePanel();
        }
    }));
    subscriptions.add(atom.workspace.addOpener((uri) => {
        if (uri === memory_panel_1.MEMORY_URI) {
            return new memory_panel_1.MemoryPanel();
        }
    }));
    subscriptions.add(atom.workspace.addOpener((uri) => {
        if (uri === welcome_pane_1.WELCOME_URI) {
            return new welcome_pane_1.WelcomePane();
        }
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${config_1.PACKAGE_NAME}:${commands_1.commit.name}`]: commands_1.commit,
        [`${config_1.PACKAGE_NAME}:${commands_1.revert.name}`]: commands_1.revert
    }));
    if (config_1.configGetter('showOnStartup')) {
        setTimeout(() => atom.workspace.open(welcome_pane_1.WELCOME_URI, {
            activateItem: true,
            split: 'left'
        }), 500);
    }
}
exports.activate = activate;
function deactivate() {
    subscriptions.dispose();
}
exports.deactivate = deactivate;
function serialize() {
    return state_1.default.getValue();
}
exports.serialize = serialize;
function deserializeModulesPane({ state }) {
    return modules_pane_1.ModulesPane.deserialize({ state });
}
exports.deserializeModulesPane = deserializeModulesPane;
function deserializeConsolePanel({ state }) {
    return console_panel_1.ConsolePanel.deserialize({ state });
}
exports.deserializeConsolePanel = deserializeConsolePanel;
function deserializeMemoryPanel({ state }) {
    return memory_panel_1.MemoryPanel.deserialize({ state });
}
exports.deserializeMemoryPanel = deserializeMemoryPanel;
function handleURI(parsedUri) {
    console.log(parsedUri);
}
exports.handleURI = handleURI;
//# sourceMappingURL=index.js.map