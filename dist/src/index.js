"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore
const packageDeps = require("atom-package-deps");
const atom_1 = require("atom");
const store_1 = require("./store");
const actions_1 = require("./store/actions");
require("./store/reducers");
const effects = require("./store/effects");
const state_1 = require("./state");
const config_1 = require("./config");
const commands_1 = require("./commands");
const welcome_pane_1 = require("./components/welcome-pane");
const console_panel_1 = require("./components/console-panel");
const memory_panel_1 = require("./components/memory-panel");
const screeps_panel_1 = require("./components/screeps-panel");
const actions_2 = require("./components/modules-block/actions");
const subscriptions = new atom_1.CompositeDisposable();
var config_2 = require("./config");
exports.config = config_2.default;
tslib_1.__exportStar(require("./consumed-services"), exports);
function initialize(state) {
    // @ts-ignore
    atom.screeps = {
        state: state_1.default
    };
    if (!state) {
        state = state_1.INITIAL_STATE;
    }
    if (!state.modules) {
        state.modules = {};
    }
    state_1.default.next(state);
    Object.values(effects).forEach((effect) => effect.subscribe());
}
exports.initialize = initialize;
function activate(state) {
    console.log('Screeps-IDE:activate', state);
    packageDeps.install('screeps-ide');
    function textEditorDidChange(textEditor) {
        const path = textEditor.getPath();
        store_1.default.dispatch(actions_1.AddTextEditorAction(path));
        return function () {
            if (!path) {
                return;
            }
            const content = textEditor.getText();
            store_1.default.dispatch(actions_1.LocalFileChangeAction(path, content));
        };
    }
    atom.workspace.getTextEditors()
        .forEach((textEditor) => {
        textEditor.onDidChange(textEditorDidChange(textEditor));
        const path = textEditor.getPath();
        const matches = /[\\\/]\.branches[\\\/]([^\\]+)[\\\/]([^\\]+)\.js/.exec(path);
        if (!matches) {
            return;
        }
        const [, branch, module] = matches;
        store_1.default.dispatch(actions_2.OpenTextEditorAction(branch, module));
    });
    atom.workspace.getCenter().onDidAddTextEditor(({ textEditor }) => {
        textEditor.onDidChange(textEditorDidChange(textEditor));
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
        [`${config_1.PACKAGE_NAME}:${commands_1.fetch.name}`]: commands_1.fetch,
        [`${config_1.PACKAGE_NAME}:${commands_1.changeProjectBranch.name}`]: commands_1.changeProjectBranch,
        [`${config_1.PACKAGE_NAME}:branches`]: () => openUri(screeps_panel_1.SCREEPS_URI),
        [`${config_1.PACKAGE_NAME}:console`]: () => openUri(console_panel_1.CONSOLE_URI),
        [`${config_1.PACKAGE_NAME}:memory`]: () => openUri(memory_panel_1.MEMORY_URI)
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
function openUri(uri) {
    atom.workspace.open(uri, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    });
}
//# sourceMappingURL=index.js.map