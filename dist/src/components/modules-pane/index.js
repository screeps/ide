"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
const decoratos_1 = require("../../decoratos");
const utils_1 = require("../../utils");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
class ModulesPane {
    constructor(_api) {
        this._api = _api;
        this.data = {};
        this.viewRef = React.createRef();
        this._eventsSbj = new rxjs_1.Subject();
        this.events$ = this._eventsSbj.asObservable();
        this.element = document.createElement('div');
        this.render(this.state);
        atom.workspace.open(this, {
            searchAllPanes: true,
            activatePane: true,
            activateItem: true,
            split: 'down',
            location: 'left'
        })
            .then(() => {
            const pane = atom.workspace.paneForItem(this);
            if (!pane) {
                return;
            }
            pane.onDidDestroy(() => {
                this._eventsSbj.next({ type: exports.ACTION_CLOSE });
            });
            // @ts-ignore
            const insetPanel = pane.element.firstChild;
            insetPanel.style.position = 'absolute';
            insetPanel.style.right = 0;
            insetPanel.style.zIndex = 1;
        });
        this.onSelectBranch('default');
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
        this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, state));
    }
    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement(ui_1.ModulesView, { ref: this.viewRef, branch: branch, branches: branches, modules: modules, onChooseModules: () => this.onChooseModules(), onChooseBranches: () => this.onChooseBranches(), onCopyBranch: (...args) => this.onCopyBranch(...args), onSelectBranch: (...args) => this.onSelectBranch(...args), onDeleteBranch: (...args) => this.onDeleteBranch(...args), onSelectModule: (...args) => this.onSelectModule(...args), onDeleteModule: (...args) => this.onDeleteModule(...args), onApplyChanges: () => this.onApplyChanges(), onRevertChanges: () => this.onRevertChanges() })), this.element);
    }
    async onChooseModules() {
    }
    async onChooseBranches() {
        if (!this.viewRef.current) {
            return;
        }
        const { list: branches } = await this._api.getUserBranches();
        //@ts-ignore
        this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { branches }));
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
        const modules = {};
        const __modules = Object.entries(_modules);
        for (let i = 0; i < __modules.length; i++) {
            const [module, content] = __modules[i];
            const moduleFile = new atom_1.File(utils_1.getModulePath(branch, module));
            let modified = false;
            const isExist = await moduleFile.exists();
            if (isExist) {
                const _content = await moduleFile.read();
                modified = content !== _content;
            }
            modules[module] = {
                content,
                modified
            };
        }
        this.state = {
            branch,
            modules
        };
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
    async onSelectModule(module) {
        const { branch, modules } = this.state;
        // @ts-ignore
        const modulePath = utils_1.getModulePath(branch, module);
        const moduleFile = new atom_1.File(modulePath);
        const isExist = await moduleFile.exists();
        const content = modules[module].content;
        if (!isExist) {
            await moduleFile.create();
            await moduleFile.write(content);
        }
        // @ts-ignore
        const textEditor = await atom.workspace.open(moduleFile.getPath(), {
            searchAllPanes: true
        });
        console.log(textEditor);
        textEditor.onDidChange(() => {
            console.log(1.1);
            const { branch: _branch, modules } = this.state;
            console.log(1.2);
            if (_branch !== branch) {
                return;
            }
            console.log(1.3);
            let modified = false;
            if (content !== textEditor.getText()) {
                modified = true;
            }
            modules[module] = Object.assign({}, modules[module], { modified });
            console.log(1.4, modules);
            this.state = { modules };
        });
    }
    async onDeleteModule(module) {
        try {
            const modules = this.state.modules;
            delete modules[module];
            this.state = { modules };
        }
        catch (err) {
            // Ignore.
        }
    }
    async onApplyChanges() {
        const { branch, modules: _modules } = this.state;
        const __modules = {};
        // @ts-ignore
        Object.entries(_modules).reduce((modules, [module, { content }]) => {
            modules[module] = content;
            return modules;
        }, __modules);
        let modules = await utils_1.readUserCode(utils_1.getBranchPath(branch));
        modules = Object.assign({}, __modules, modules);
        try {
            await this._api.updateUserCode({ branch, modules });
            await this.onSelectBranch(branch);
        }
        catch (err) {
            // Noop.
        }
    }
    async onRevertChanges() {
    }
    // Atom pane required interface's methods
    getURI() {
        return 'atom://screeps-ide-modules-view';
    }
    getTitle() {
        return '';
    }
    isPermanentDockItem() {
        return false;
    }
    getAllowedLocations() {
        return ['left'];
    }
}
tslib_1.__decorate([
    decoratos_1.progress
], ModulesPane.prototype, "onChooseBranches", null);
tslib_1.__decorate([
    decoratos_1.progress
], ModulesPane.prototype, "onSelectBranch", null);
exports.ModulesPane = ModulesPane;
//# sourceMappingURL=index.js.map