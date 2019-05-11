"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
// import pako from 'pako';
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const state_1 = require("../../state");
const branches_block_1 = require("../branches-block");
const modules_block_1 = require("../modules-block");
const console_panel_1 = require("../console-panel");
const memory_panel_1 = require("../memory-panel");
const actions_1 = require("./actions");
require("./reducers");
const effects = require("./effects");
const store_1 = require("../../store");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
exports.SCREEPS_URI = 'atom://screeps-ide/screeps';
class ScreepsPanel {
    constructor(state = state_1.default.getValue()) {
        this.state = state;
        this._user = null;
        this._socket = null;
        this.element = document.createElement('div');
        Object.values(effects).forEach((effect) => effect.subscribe());
        state_1.default
            .pipe(operators_1.distinctUntilChanged())
            .pipe(operators_1.tap((state) => this.render(state)))
            .subscribe();
        (async () => {
            try {
                const _api = await utils_1.getApi();
                this._user = await utils_1.getUser();
                this._socket = utils_1.getSocket();
                this._socket.on(`user:${this._user.id}/code`)
                    .pipe(operators_1.tap(({ data: [, { branch, modules }] }) => {
                    store_1.default.dispatch(actions_1.UpdateModulesAction(branch, modules));
                }))
                    .subscribe();
                const { list: branches } = await _api.getUserBranches();
                // Тут второй раз срабатывает next
                state_1.default.next(Object.assign({}, state_1.default.getValue(), { branches }));
            }
            catch (err) {
                console.log(err);
                setTimeout(() => destroy(this));
                this.destroy();
            }
        })();
        // TODO: тут надо сделать выставление статуса активный модуль
        atom.workspace.onDidChangeActivePaneItem((pane) => {
            if (!(pane instanceof atom_1.TextEditor)) {
                return;
            }
            // @ts-ignore
            // console.log(pane.getPath());
            // const path = pane.getPath() as string;
            // store.dispatch(ActiveModule())
        });
    }
    render({ branch, branches, modules }) {
        console.log(branch, branches, modules);
        const _modules = modules[branch];
        let modulesView;
        if (_modules) {
            modulesView = (React.createElement(modules_block_1.ModulesBlock, { branch: branch, modules: _modules }));
        }
        ReactDOM.render(React.createElement("div", { className: 'screeps-ide screeps-panel' },
            React.createElement(branches_block_1.BranchesBlock, { branch: branch, branches: branches }),
            modulesView,
            React.createElement("button", { className: 'btn btn-primary' }, "Create Project"),
            React.createElement("button", { className: 'btn btn-primary', onClick: this.openMemoryPanel }, "Open Memory Panel"),
            React.createElement("button", { className: 'btn btn-primary', onClick: this.openConsolePanel }, "Open Console Panel")), this.element);
    }
    openMemoryPanel() {
        atom.workspace.open(memory_panel_1.MEMORY_URI, {
            activatePane: true,
            activateItem: true,
            // split: 'down',
            location: 'bottom'
        });
    }
    openConsolePanel() {
        atom.workspace.open(console_panel_1.CONSOLE_URI, {
            activatePane: true,
            activateItem: true,
            // split: 'down',
            location: 'bottom'
        });
    }
    destroy() {
        if (this._socket && this._user) {
            this._socket.on(`user:${this._user.id}/code`);
        }
    }
    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ScreepsPanel',
            state: this.state
        };
    }
    static deserialize({ state }) {
        return new ScreepsPanel(state);
    }
    // Atom view model required interface's methods
    getURI() {
        return exports.SCREEPS_URI;
    }
    getTitle() {
        return 'Screeps';
    }
    getDefaultLocation() {
        'left';
    }
    getAllowedLocations() {
        return ['left', 'right'];
    }
}
exports.ScreepsPanel = ScreepsPanel;
function destroy(item) {
    const pane = atom.workspace.paneForItem(item);
    if (!pane) {
        return;
    }
    pane.destroyItem(item);
}
//# sourceMappingURL=index.js.map