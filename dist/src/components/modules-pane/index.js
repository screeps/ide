"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require('fs');
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
const operators_1 = require("rxjs/operators");
const state_1 = require("../../state");
const ui_1 = require("../../../ui");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
const decoratos_1 = require("../../decoratos");
const utils_1 = require("../../utils");
const commands_1 = require("../../commands");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
exports.MODULES_URI = 'atom://screeps-ide/modules';
class ModulesPane {
    constructor(state = {}) {
        this.viewRef = React.createRef();
        this.element = document.createElement('div');
        this.render(state);
        // atom.project.onDidChangeFiles((events) => {
        //     events.forEach(({ path }) => this.onDidChange({ path }));
        // });
        atom.workspace.onDidChangeActivePaneItem((pane) => {
            if (!(pane instanceof atom_1.TextEditor)) {
                return;
            }
            const path = pane.getPath();
            this.onDidChangeActivePaneItem({ path });
        });
        (async () => {
            const api = await utils_1.getApi();
            await utils_1.getUser();
            this._api = api;
            // TODO: need to destory subscribtion
            state_1.default
                .pipe(operators_1.map(({ branch }) => branch))
                .pipe(operators_1.distinctUntilChanged())
                .pipe(operators_1.tap((branch) => this.onSelectBranch(branch)))
                .subscribe();
            state_1.default
                .pipe(operators_1.map(({ modules }) => modules))
                .pipe(operators_1.distinctUntilChanged())
                .pipe(operators_1.tap((modules) => this.state = { modules }))
                .subscribe();
        })();
    }
    get state() {
        if (!this.viewRef.current) {
            return {
                branch: 'default',
                modules: {}
            };
        }
        return this.viewRef.current.state;
    }
    set state(state) {
        if (!this.viewRef.current) {
            return;
        }
        this.viewRef.current.state = Object.assign({}, this.viewRef.current.state, state);
        this.viewRef.current.setState(this.viewRef.current.state);
    }
    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement(ui_1.ModulesView, { ref: this.viewRef, branch: branch, branches: branches, modules: modules, onChooseModules: () => this.onChooseModules(), onChooseBranches: () => this.onChooseBranches(), onCopyBranch: (...args) => this.onCopyBranch(...args), onSelectBranch: (...args) => this.onSelectBranch(...args), onDeleteBranch: (...args) => this.onDeleteBranch(...args), onCreateModule: (...args) => this.onCreateModule(...args), onSelectModule: (...args) => this.onSelectModule(...args), onDeleteModule: (...args) => this.onDeleteModule(...args), onApplyChanges: () => this.onApplyChanges(), onRevertChanges: () => this.onRevertChanges() })), this.element);
    }
    async onChooseModules() {
    }
    async onChooseBranches() {
        const { list: branches } = await this._api.getUserBranches();
        this.state = { branches };
    }
    async onCopyBranch(branch) {
        try {
            const newName = await prompt_modal_1.default({
                legend: 'This branch will be cloned to the new branch. Please enter a new branch name:'
            });
            await this._api.cloneUserBranch({ branch, newName });
            this.onChooseBranches();
        }
        catch (err) {
            // Ignore.
        }
    }
    async onSelectBranch(_branch) {
        const { branch, modules: _modules } = await this._api.getUserCode(_branch);
        const changes = await utils_1.readUserCode(utils_1.getBranchPath(branch));
        const modules = utils_1.combineModules(Object.assign({}, changes, _modules), changes);
        state_1.default.next(Object.assign({}, state_1.default.getValue(), { branch,
            modules }));
        this.state = { branch };
    }
    async onDeleteBranch(branch) {
        try {
            await confirm_modal_1.default({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });
            await this._api.deleteUserBranch(branch);
            this.onChooseBranches();
        }
        catch (err) {
            // Ignore.
        }
    }
    async onCreateModule(module) {
        const { modules } = this.state;
        this.state = {
            modules: Object.assign({}, modules, { [module]: {
                    content: null,
                    modified: true
                } })
        };
        this.onSelectModule(module);
    }
    async onSelectModule(module) {
        const { branch, modules } = this.state;
        // @ts-ignore
        const modulePath = utils_1.getModulePath(branch, module);
        const moduleFile = new atom_1.File(modulePath);
        const isExist = await moduleFile.exists();
        const content = modules[module].content || '';
        if (!isExist) {
            await moduleFile.create();
            await moduleFile.write(content);
        }
        // let isTextEditor = 
        // atom.workspace.getTextEditors()
        //     .find((textEditor) => textEditor.getPath() === moduleFile.getPath());
        // let textEditor = 
        await atom.workspace.open(moduleFile.getPath(), {
            searchAllPanes: true
        });
        // if (isTextEditor) {
        //     return;
        // }
        // textEditor.onDidSave(({ path }) => {
        //     this.onDidChange({ path })
        // });
    }
    async onDeleteModule(module) {
        const { branch, modules } = this.state;
        this.state = {
            modules: Object.assign({}, modules, { [module]: Object.assign({}, modules[module], { deleted: true }) })
        };
        const modulePath = utils_1.getModulePath(branch, module);
        try {
            fs.unlink(modulePath, () => { });
        }
        catch (err) {
            // Noop.
        }
    }
    async onApplyChanges() {
        commands_1.commitAll();
    }
    async onRevertChanges() {
        const { branch, modules } = this.state;
        const entries = Object.entries(modules);
        for (let i = 0, l = entries.length; i < l; i++) {
            const [module, { content, modified, deleted }] = entries[i];
            if (!modified && !deleted) {
                continue;
            }
            const modulePath = utils_1.getModulePath(branch, module);
            const moduleFile = new atom_1.File(modulePath);
            try {
                await moduleFile.write(content || '');
            }
            catch (err) {
                // Noop.
            }
            modules[module] = {
                content,
                modified: false
            };
        }
        this.state = { modules };
    }
    async onDidChangeActivePaneItem({ path }) {
        const module = utils_1.getModuleByPath(path);
        if (!module) {
            return;
        }
        let { modules } = this.state;
        modules = Object.entries(modules).reduce((modules, [_module, data]) => (Object.assign({}, modules, { [_module]: Object.assign({}, data, { active: module === _module }) })), {});
        this.state = { modules };
    }
    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ModulesPane',
            state: this.state
        };
    }
    static deserialize({ state }) {
        return new ModulesPane(state);
    }
    // Atom pane required interface's methods
    getURI() {
        return exports.MODULES_URI;
    }
    getTitle() {
        return 'Modules';
    }
    getDefaultLocation() {
        'left';
    }
    getAllowedLocations() {
        return ['left', 'right'];
    }
}
tslib_1.__decorate([
    decoratos_1.progress
], ModulesPane.prototype, "onChooseBranches", null);
tslib_1.__decorate([
    decoratos_1.progress
], ModulesPane.prototype, "onSelectBranch", null);
tslib_1.__decorate([
    decoratos_1.progress
], ModulesPane.prototype, "onApplyChanges", null);
exports.ModulesPane = ModulesPane;
//# sourceMappingURL=index.js.map