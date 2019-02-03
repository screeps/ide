"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
class ModulesPane {
    constructor(_api) {
        this._api = _api;
        this.data = {};
        this.modulesViewRef = React.createRef();
        this.onSelectModule = (module) => {
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
        };
        this.onChooseModules = () => {
        };
        this.onCopyBranch = async (branch) => {
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
        };
        this.onSelectBranch = async (_branch) => {
            const { branch, modules } = await this._api.getUserCode(_branch);
            //@ts-ignore
            this.render({ branch, modules });
        };
        this.onDeleteBranch = async (branch) => {
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
        };
        this.onChooseBranches = async () => {
            if (!this.modulesViewRef.current) {
                return;
            }
            console.log(1);
            const { list: branches } = await this._api.getUserBranches();
            console.log(1.1, branches);
            //@ts-ignore
            this.modulesViewRef.current.setState(Object.assign({}, this.modulesViewRef.current.state, { branches }));
        };
        this.element = document.createElement('div');
        atom.workspace.open(this, {
            searchAllPanes: true,
            activatePane: true,
            activateItem: true,
            split: 'down',
            location: 'left'
        })
            .then(() => {
            const pane = atom.workspace.paneForItem(this);
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
    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement(ui_1.ModulesView, { ref: this.modulesViewRef, branch: branch, branches: branches, modules: modules, onSelectModule: this.onSelectModule, onChooseModules: this.onChooseModules, onCopyBranch: this.onCopyBranch, onSelectBranch: this.onSelectBranch, onDeleteBranch: this.onDeleteBranch, onChooseBranches: this.onChooseBranches })), this.element);
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
exports.ModulesPane = ModulesPane;
//# sourceMappingURL=index.js.map