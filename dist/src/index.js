"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const modules_pane_1 = require("./components/modules-pane");
const tree_view_dir_1 = require("./components/tree-view-dir");
const config_1 = require("./config");
const commands_1 = require("./commands");
const service_1 = require("./service");
const subscriptions = new atom_1.CompositeDisposable();
var config_2 = require("./config");
exports.config = config_2.default;
tslib_1.__exportStar(require("./consumed-services"), exports);
function initialize(state) {
    console.log('Screeps-IDE:initialize', state);
}
exports.initialize = initialize;
function activate(state) {
    console.log('Screeps-IDE:activate', state);
    const _service = new service_1.Service();
    _service.getUserCode();
    new tree_view_dir_1.TreeViewDir(_service);
    new modules_pane_1.ModulesPane(_service);
    //@ts-ignore
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${config_1.PACKAGE_NAME}:${commands_1.authCommand.name}`]: commands_1.authCommand,
        [`${config_1.PACKAGE_NAME}:${commands_1.startCommand.name}`]: commands_1.startCommand,
        [`${config_1.PACKAGE_NAME}:${commands_1.commitCommand.name}`]: commands_1.commitCommand
    }));
}
exports.activate = activate;
function deactivate() {
    subscriptions.dispose();
}
exports.deactivate = deactivate;
function serialize() {
    return {};
}
exports.serialize = serialize;
function handleURI(parsedUri) {
    console.log(parsedUri);
}
exports.handleURI = handleURI;
//# sourceMappingURL=index.js.map