import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModulesView } from '../../../ui';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { Api } from '../../api';

export class ModulesPane {
    public element: HTMLElement;

    public data: any = {};

    modulesViewRef = React.createRef<ModulesView>();

    public get state() {
        if (!this.modulesViewRef.current) {
            return {
                branch: 'default',
                modules: []
            };
        }

        return this.modulesViewRef.current.state;
    }

    constructor(
        private _api: Api
    ) {
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

    render({ modules = {}, branch = '', branches = [] }) {
        ReactDOM.render(
            <div>
                <ModulesView ref={ this.modulesViewRef }
                    branch={ branch }
                    branches={ branches }

                    modules={ modules }

                    onSelectModule={ this.onSelectModule }
                    onChooseModules={ this.onChooseModules }

                    onCopyBranch={ this.onCopyBranch }
                    onSelectBranch={ this.onSelectBranch }
                    onDeleteBranch={ this.onDeleteBranch }
                    onChooseBranches={ this.onChooseBranches }
                />
            </div>,
            this.element as HTMLElement
        )
    }

    onSelectModule = (module: any) => {
        if (!this.modulesViewRef.current) {
            return;
        }

        const textEditor = atom.workspace.buildTextEditor({ autoHeight: false });
        const { branch, modules } = this.modulesViewRef.current.state;

        textEditor.setText(modules[module]);
        textEditor.getTitle = () => `@${ branch }/${ module }.js`;

        const grammar = atom.grammars.grammarForScopeName('source.js');
        if (grammar) {
            atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
        }

        atom.workspace.open(textEditor, {
        });
    }

    onChooseModules = () => {
    }


    onCopyBranch = async (branch: string) => {
        try {
            const newName = await prompt({
                legend: 'This branch will be cloned to the new branch. Please enter a new branch name:'
            });

            await this._api.cloneUserBranch({ branch, newName });

            this.onChooseBranches();
        } catch(err) {
            // Ignore.
        }
    }

    onSelectBranch = async (_branch?: string) => {
        const { branch, modules } = await this._api.getUserCode(_branch);

        //@ts-ignore
        this.render({ branch, modules });
    }

    onDeleteBranch = async (branch: string) => {
        try {
            await confirm({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });

            await this._api.deleteUserBranch(branch);

            this.onChooseBranches();
        } catch(err) {
            // Ignore.
        }
    }

    onChooseBranches = async () => {
        if (!this.modulesViewRef.current) {
            return;
        }

        console.log(1);
        const { list: branches } = await this._api.getUserBranches();
        console.log(1.1, branches );

        //@ts-ignore
        this.modulesViewRef.current.setState({
            ...this.modulesViewRef.current.state,
            branches
        });
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
