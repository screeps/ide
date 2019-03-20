import { File, TextEditor } from 'atom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Observable } from 'rxjs';

import { ModulesView } from '../../../ui';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { Api } from '../../api';
import { progress } from '../../decoratos';
import { getModulePath, getBranchPath, readUserCode } from '../../utils';

export const ACTION_CLOSE = 'ACTION_CLOSE';

export class ModulesPane {
    public element: HTMLElement;

    public data: any = {};

    viewRef = React.createRef<ModulesView>();

    private _eventsSbj = new Subject();
    public events$: Observable<any> = this._eventsSbj.asObservable();

    public get state(): any {
        if (!this.viewRef.current) {
            return {
                branch: 'default',
                modules: {}
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

    render({ modules = {}, branch = '', branches = [] }: IModulesViewState) {
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
                    onDeleteModule={(...args) => this.onDeleteModule(...args)}

                    onApplyChanges={() => this.onApplyChanges()}
                    onRevertChanges={() => this.onRevertChanges()}
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
        const { branch, modules: _modules } = await this._api.getUserCode(_branch);

        const modules:  {
            [key: string]: IModule;
        } = {};

        const __modules = Object.entries(_modules);
        for(let i = 0; i < __modules.length; i++) {
            const [module, content] = __modules[i];

            const moduleFile = new File(getModulePath(branch, module));
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

    async onSelectModule(module: string): Promise<void> {
        const { branch, modules } = this.state;

        // @ts-ignore
        const modulePath = getModulePath(branch, module);
        const moduleFile = new File(modulePath);
        const isExist = await moduleFile.exists();
        const content = modules[module].content;

        if (!isExist) {
            await moduleFile.create();
            await moduleFile.write(content);
        }

        // @ts-ignore
        const textEditor: TextEditor = await atom.workspace.open(moduleFile.getPath(), {
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

            modules[module] = {
                ...modules[module],
                modified
            };

            console.log(1.4, modules);
            this.state = { modules };
        })
    }

    async onDeleteModule(module: string): Promise<void> {
        try {
            const modules = this.state.modules;
            delete modules[module];

            this.state = { modules }
        } catch(err) {
            // Ignore.
        }
    }

    async onApplyChanges(): Promise<void> {
        const { branch, modules: _modules } = this.state;

        const __modules: {
            [key: string]: string;
        } = {};

        // @ts-ignore
        Object.entries(_modules).reduce((modules, [module, { content }]) => {
            modules[module] = content;
            return modules;
        }, __modules);

        let modules = await readUserCode(getBranchPath(branch));
        modules = {
            ...__modules,
            ...modules
        };

        try {
            await this._api.updateUserCode({ branch, modules });
            await this.onSelectBranch(branch);
        } catch(err) {
            // Noop.
        }

    }

    async onRevertChanges(): Promise<void> {

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
