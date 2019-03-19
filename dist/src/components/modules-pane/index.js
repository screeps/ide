"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
const decoratos_1 = require("../../decoratos");
// import { AtomModal } from '../atom-modal';
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
                modules: []
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
            React.createElement(ui_1.ModulesView, { ref: this.viewRef, branch: branch, branches: branches, modules: modules, onChooseModules: () => this.onChooseModules(), onChooseBranches: () => this.onChooseBranches(), onCopyBranch: (...args) => this.onCopyBranch(...args), onSelectBranch: (...args) => this.onSelectBranch(...args), onDeleteBranch: (...args) => this.onDeleteBranch(...args), onSelectModule: (...args) => this.onSelectModule(...args) })), this.element);
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
        if (!this.viewRef.current) {
            return;
        }
        const { branch, modules } = this.viewRef.current.state;
        const title = `@${branch}/${module}.js`;
        const textEditors = atom.workspace.getTextEditors();
        let textEditor = textEditors.find((textEditor) => {
            return textEditor.getTitle() === title;
        });
        if (textEditor) {
            atom.workspace.open(textEditor);
            return;
        }
        textEditor = atom.workspace.buildTextEditor({ autoHeight: false });
        textEditor.setText(modules[module]);
        textEditor.getTitle = () => `${title}`;
        // @ts-ignore
        textEditor.readOnly = true;
        const grammar = atom.grammars.grammarForScopeName('source.js');
        if (grammar) {
            atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
        }
        atom.workspace.open(textEditor, {});
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