"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
class ModulesPane {
    constructor(_service) {
        this._service = _service;
        this.data = {};
        this.onChooseModules = () => {
        };
        this.onChooseBranches = () => {
            this._service.getUserBranches();
        };
        this.onSelectBranch = (branch) => {
            this._service.getUserCode(branch);
        };
        this.onSelectModule = (module) => {
            const textEditor = atom.workspace.buildTextEditor({ autoHeight: false });
            const { branch, modules } = this._service.state.getValue();
            textEditor.setText(modules[module]);
            textEditor.getTitle = () => `@${branch}/${module}.js`;
            const grammar = atom.grammars.grammarForScopeName('source.js');
            if (grammar) {
                atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
            }
            atom.workspace.open(textEditor, {});
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
        this._service.state$.subscribe((state) => {
            this.render(state);
        });
    }
    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(React.createElement("div", null,
            React.createElement(ui_1.ModulesView, { branch: branch, branches: branches, modules: modules, onChooseModules: this.onChooseModules, onChooseBranches: this.onChooseBranches, onSelectBranch: this.onSelectBranch, onSelectModule: this.onSelectModule })), this.element);
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