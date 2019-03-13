"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
let animationStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
exports.ACTION_CLOSE = 'ACTION_CLOSE';
// @ts-ignore
function progress(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        this.showProgress();
        let result;
        try {
            result = await original.apply(this, args);
        }
        catch (err) {
            // Noop.
        }
        this.hideProgress();
        return result;
    };
    return descriptor;
}
class ModulesPane {
    constructor(_api) {
        this._api = _api;
        this.data = {};
        this.modulesViewRef = React.createRef();
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
        if (!this.modulesViewRef.current) {
            return {
                branch: 'default',
                modules: []
            };
        }
        return this.modulesViewRef.current.state;
    }
    set state(state) {
        if (!this.modulesViewRef.current) {
            return;
        }
        this.modulesViewRef.current.setState(Object.assign({}, this.modulesViewRef.current.state, state));
    }
    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement(ui_1.ModulesView, { ref: this.modulesViewRef, branch: branch, branches: branches, modules: modules, onChooseModules: () => this.onChooseModules(), onChooseBranches: () => this.onChooseBranches(), onCopyBranch: (...args) => this.onCopyBranch(...args), onSelectBranch: (...args) => this.onSelectBranch(...args), onDeleteBranch: (...args) => this.onDeleteBranch(...args), onSelectModule: (...args) => this.onSelectModule(...args) })), this.element);
    }
    async onChooseModules() {
    }
    async onChooseBranches() {
        if (!this.modulesViewRef.current) {
            return;
        }
        const { list: branches } = await this._api.getUserBranches();
        //@ts-ignore
        this.modulesViewRef.current.setState(Object.assign({}, this.modulesViewRef.current.state, { branches }));
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
        const { branch, modules } = await this._api.getUserCode(_branch);
        this.state = { branch, modules };
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
        if (!this.modulesViewRef.current) {
            return;
        }
        const textEditor = atom.workspace.buildTextEditor({ autoHeight: false });
        const { branch, modules } = this.modulesViewRef.current.state;
        textEditor.setText(modules[module]);
        textEditor.getTitle = () => `@${branch}/${module}.js`;
        const grammar = atom.grammars.grammarForScopeName('source.js');
        if (grammar) {
            atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
        }
        atom.workspace.open(textEditor, {});
    }
    showProgress() {
        animationStartTime = new Date().getTime();
        if (!this.modulesViewRef.current) {
            return;
        }
        this.modulesViewRef.current.state.isProgressing = true;
        this.modulesViewRef.current.setState(Object.assign({}, this.modulesViewRef.current.state));
    }
    hideProgress() {
        const now = new Date().getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);
        setTimeout(() => {
            if (!this.modulesViewRef.current) {
                return;
            }
            this.modulesViewRef.current.state.isProgressing = false;
            this.modulesViewRef.current.setState(Object.assign({}, this.modulesViewRef.current.state));
        }, delay > 0 ? delay : 0);
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
    progress
], ModulesPane.prototype, "onChooseBranches", null);
tslib_1.__decorate([
    progress
], ModulesPane.prototype, "onSelectBranch", null);
exports.ModulesPane = ModulesPane;
//# sourceMappingURL=index.js.map