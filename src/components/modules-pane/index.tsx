import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModulesView } from '../../../ui';

import { Service } from '../../service';

export class ModulesPane {
    public element: HTMLElement;

    public data: any = {};

    constructor(private _service: Service) {
        this.element = document.createElement('div');

        atom.workspace.open(this, {
            searchAllPanes: true,
            activatePane: true,
            activateItem: true,
            split: 'down',
            location: 'left'
        });

        this._service.state$.subscribe((state) => {
            this.render(state);
        });
    }

    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(
            <div>
                <ModulesView
                    branch={ branch }
                    branches={ branches }

                    modules={ modules }

                    onChooseModules={ this.onChooseModules }
                    onChooseBranches={ this.onChooseBranches }
                    onSelectBranch={ this.onSelectBranch }
                    onSelectModule={ this.onSelectModule }
                />
            </div>,
            this.element as HTMLElement
        )
    }

    onChooseModules = () => {
    }

    onChooseBranches = () => {
        this._service.getUserBranches();
    }

    onSelectBranch = (branch?: string) => {
        this._service.getUserCode(branch);
    }

    onSelectModule = (module: any) => {
        const textEditor = atom.workspace.buildTextEditor({ autoHeight: false });

        const { branch, modules } = this._service.state.getValue();

        textEditor.setText(modules[module]);
        textEditor.getTitle = () => `@${ branch }/${ module }.js`;

        const grammar = atom.grammars.grammarForScopeName('source.js');
        if (grammar) {
            atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
        }

        atom.workspace.open(textEditor, {
        });
    }

    getURI() {
        return 'atom://screeps-ide-modules-view';
    }

    getTitle() {
        return '';
    }

    isPermanentDockItem() {
        return true;
    }

    getAllowedLocations() {
        return ['left'];
    }
}
