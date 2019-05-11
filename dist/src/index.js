"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference path='./index.d.ts' />
const atom_1 = require("atom");
const store_1 = require("./store");
const state_1 = require("./state");
const config_1 = require("./config");
const commands_1 = require("./commands");
const welcome_pane_1 = require("./components/welcome-pane");
const console_panel_1 = require("./components/console-panel");
const memory_panel_1 = require("./components/memory-panel");
const screeps_panel_1 = require("./components/screeps-panel");
const actions_1 = require("./components/modules-block/actions");
const subscriptions = new atom_1.CompositeDisposable();
var config_2 = require("./config");
exports.config = config_2.default;
tslib_1.__exportStar(require("./consumed-services"), exports);
function initialize(state) {
    if (!state) {
        state = state_1.INITIAL_STATE;
    }
    if (!state.modules) {
        state.modules = {};
    }
    state_1.default.next(state);
    atom.project.onDidChangeFiles(commands_1.onDidChangeFiles);
}
exports.initialize = initialize;
function activate(state) {
    console.log('Screeps-IDE:activate', state);
    atom.workspace.getTextEditors()
        .forEach((textEditor) => {
        const path = textEditor.getPath();
        const matches = /[\\\/]\.branches[\\\/]([^\\]+)[\\\/]([^\\]+)\.js/.exec(path);
        if (!matches) {
            return;
        }
        const [, branch, module] = matches;
        store_1.default.dispatch(actions_1.OpenTextEditorAction(branch, module));
    });
    subscriptions.add(atom.workspace.addOpener((uri) => {
        if (uri === screeps_panel_1.SCREEPS_URI) {
            return new screeps_panel_1.ScreepsPanel();
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
        [`${config_1.PACKAGE_NAME}:${commands_1.commitAll.name}`]: commands_1.commitAll,
        [`${config_1.PACKAGE_NAME}:${commands_1.revert.name}`]: commands_1.revert,
        [`${config_1.PACKAGE_NAME}:${commands_1.revertAll.name}`]: commands_1.revertAll
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
    // return {};
    return state_1.default.getValue();
}
exports.serialize = serialize;
function deserializeConsolePanel({ state }) {
    return console_panel_1.ConsolePanel.deserialize({ state });
}
exports.deserializeConsolePanel = deserializeConsolePanel;
function deserializeMemoryPanel({ state }) {
    return memory_panel_1.MemoryPanel.deserialize({ state });
}
exports.deserializeMemoryPanel = deserializeMemoryPanel;
function deserializeScreepsPanel({ state }) {
    return screeps_panel_1.ScreepsPanel.deserialize({ state });
}
exports.deserializeScreepsPanel = deserializeScreepsPanel;
function handleURI(parsedUri) {
    console.log(parsedUri);
}
exports.handleURI = handleURI;
//# sourceMappingURL=index.js.map