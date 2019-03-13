import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Observable } from 'rxjs';

import { ModulesView } from '../../../ui';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { Api } from '../../api';
import { progress } from '../../decoratos';

export const ACTION_CLOSE = 'ACTION_CLOSE';

export class ModulesPane {
    public element: HTMLElement;

    public data: any = {};

    viewRef = React.createRef<ModulesView>();

    private _eventsSbj = new Subject();
    public events$: Observable<any> = this._eventsSbj.asObservable();

    public get state() {
        if (!this.viewRef.current) {
            return {
                branch: 'default',
                modules: []
            };
        }

        return this.viewRef.current.state;
    }

    public set state(state: any) {
        if (!this.viewRef.current) {
            return;
        }

        this.viewRef.current.setState({
            ...this.viewRef.current.state,
            ...state
        });
    }

    constructor(
        private _api: Api
    ) {
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
                    this._eventsSbj.next({ type: ACTION_CLOSE });
                });

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
                <ModulesView ref={ this.viewRef }
                    branch={ branch }
                    branches={ branches }

                    modules={ modules }

                    onChooseModules={() => this.onChooseModules()}
                    onChooseBranches={() => this.onChooseBranches()}

                    onCopyBranch={(...args) => this.onCopyBranch(...args)}
                    onSelectBranch={(...args) => this.onSelectBranch(...args)}
                    onDeleteBranch={(...args) => this.onDeleteBranch(...args)}
                    onSelectModule={(...args) => this.onSelectModule(...args)}
                />
            </div>,
            this.element as HTMLElement
        )
    }

    async onChooseModules(): Promise<void> {
    }

    @progress
    async onChooseBranches(): Promise<void> {
        if (!this.viewRef.current) {
            return;
        }

        const { list: branches } = await this._api.getUserBranches();

        //@ts-ignore
        this.viewRef.current.setState({
            ...this.viewRef.current.state,
            branches
        });
    }

    async onCopyBranch(branch: string): Promise<void> {
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

    @progress
    async onSelectBranch(_branch?: string): Promise<void> {
        const { branch, modules } = await this._api.getUserCode(_branch);

        this.state = { branch, modules };
    }

    async onDeleteBranch(branch: string): Promise<void> {
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

    async onSelectModule(module: any): Promise<void> {
        if (!this.viewRef.current) {
            return;
        }

        const textEditor = atom.workspace.buildTextEditor({ autoHeight: false });
        const { branch, modules } = this.viewRef.current.state;

        textEditor.setText(modules[module]);
        textEditor.getTitle = () => `@${ branch }/${ module }.js`;

        const grammar = atom.grammars.grammarForScopeName('source.js');
        if (grammar) {
            atom.textEditors.setGrammarOverride(textEditor, grammar.scopeName);
        }

        atom.workspace.open(textEditor, {
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
