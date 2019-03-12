import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModulesView } from '../../../ui';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { Api } from '../../api';

let animationStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

// @ts-ignore
function progress(target: any, name: any, descriptor: any) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        this.showProgress();

        let result;
        try {
            result = await original.apply(this, args);
        } catch (err) {
            // Noop.
        }

        this.hideProgress();
        return result;
    };

    return descriptor;
}

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

    public set state(state: any) {
        if (!this.modulesViewRef.current) {
            return;
        }

        this.modulesViewRef.current.setState({
            ...this.modulesViewRef.current.state,
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

    async onChooseBranches(): Promise<void> {
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

    showProgress() {
        animationStartTime = new Date() .getTime();

        if (!this.modulesViewRef.current) {
            return;
        }

        console.log('show progress', this.modulesViewRef.current.state);

        this.modulesViewRef.current.state.isProgressing = true;
        this.modulesViewRef.current.setState({
            ...this.modulesViewRef.current.state
        });
    }

    hideProgress() {
        const now = new Date() .getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);

        setTimeout(() => {
            if (!this.modulesViewRef.current) {
                return;
            }

            console.log('hide progress', this.modulesViewRef.current.state);

            this.modulesViewRef.current.state.isProgressing = false;
            this.modulesViewRef.current.setState({
                ...this.modulesViewRef.current.state
            });
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
