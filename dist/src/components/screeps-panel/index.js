"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
// import pako from 'pako';
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const state_1 = require("../../state");
const ui_1 = require("../../../ui");
const branches_block_1 = require("../branches-block");
const modules_block_1 = require("../modules-block");
const console_panel_1 = require("../console-panel");
const memory_panel_1 = require("../memory-panel");
const resizable_panel_1 = require("../../../ui/components/resizable-panel");
const actions_1 = require("./actions");
require("./reducers");
const actions_2 = require("./actions");
const store_1 = require("../../store");
const actions_3 = require("../../store/actions");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
exports.SCREEPS_URI = 'atom://screeps-ide/screeps';
let subscriptions = new atom_1.CompositeDisposable();
class ScreepsPanel {
    constructor(state = {}) {
        this._user = null;
        this._socket = null;
        this._state = {
            branch: 'default',
            branches: [],
            modules: {}
        };
        this.element = document.createElement('div');
        this.state = state;
        state_1.default
            .pipe(operators_1.distinctUntilChanged())
            .pipe(operators_1.tap((state) => this.state = state))
            .pipe(operators_1.filter(({ branches }) => !!(branches && branches.length)))
            .pipe(operators_1.tap(({ branches }) => {
            subscriptions.dispose();
            subscriptions = new atom_1.CompositeDisposable();
            for (let { _id } of branches) {
                let d;
                d = utils_1.applyTooltip(`#${ui_1.BTN_BRANCHES_CLONE}-${_id}`, 'Clone branch', this.element);
                d && subscriptions.add(d);
                d = utils_1.applyTooltip(`#${ui_1.BTN_BRANCHES_DELETE}-${_id}`, 'Delete branch', this.element);
                d && subscriptions.add(d);
            }
        }))
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
        atom.workspace.getCenter().onDidChangeActivePaneItem((pane) => {
            let branch = null;
            let module = null;
            if (pane instanceof atom_1.TextEditor) {
                const path = pane.getPath();
                const matches = /[\\\/]\.branches[\\\/]([^\\]+)[\\\/]([^\\]+)\.js/.exec(path);
                if (matches) {
                    [, branch, module] = matches;
                }
            }
            store_1.default.dispatch(actions_2.SetActiveModule(branch, module));
        });
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = Object.assign({}, this._state, state);
        this.render(this.state);
    }
    render({ branch = '', branches = [], branchesBlockHeight, modules = {}, activeBranchTextEditor, activeModuleTextEditor }) {
        const _modules = modules[branch];
        let modulesView;
        if (_modules) {
            modulesView = (React.createElement(modules_block_1.ModulesBlock, { branch: branch, modules: _modules, active: `@${activeBranchTextEditor}/${activeModuleTextEditor}` }));
        }
        ReactDOM.render(React.createElement("div", { className: 'screeps-ide screeps-panel' },
            React.createElement(resizable_panel_1.default, { height: branchesBlockHeight, onChangeHeight: (branchesBlockHeight) => this.state = { branchesBlockHeight } },
                React.createElement(branches_block_1.BranchesBlock, { branch: branch, branches: branches, active: activeBranchTextEditor })),
            modulesView,
            React.createElement("footer", null,
                React.createElement("button", { className: 'btn btn-primary', onClick: this.createProject }, "Create New Project"),
                React.createElement("div", null,
                    React.createElement("button", { className: 'btn', onClick: this.openMemoryPanel }, "Memory"),
                    React.createElement("button", { className: 'btn', onClick: this.openConsolePanel }, "Console")))), this.element);
    }
    createProject() {
        store_1.default.dispatch(actions_3.CreateProjectAction());
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