import { File, TextEditor } from 'atom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Observable } from 'rxjs';

import { ModulesView } from '../../../ui';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { Api } from '../../api';
import { progress } from '../../decoratos';
import {
    // isProjectExist,
    getModulePath,
    getModuleByPath,
    getBranchPath, 
    readUserCode
} from '../../utils';

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

        this.open();
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

        const changes = await readUserCode(getBranchPath(branch));

        const modules = await this.toModules({
            ...changes,
            ..._modules
        }, changes);

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

        let textEditor = atom.workspace.getTextEditors()
            .find((textEditor) => textEditor.getPath() === moduleFile.getPath());

        if (textEditor) {
            return;
        }

        textEditor = await atom.workspace.open(moduleFile.getPath(), {
            searchAllPanes: true
        }) as TextEditor;

        textEditor.onDidSave(({ path }) => {
            this.onDidChange({ path })
        });

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

    @progress
    async onApplyChanges(): Promise<void> {
        const {
            branch, modules: _modules
        }: {
            branch: string, modules: IModulesViewModules
        } = this.state;

        let modules: IModules = Object.entries(_modules).reduce((modules, [module, { content }]) => ({
            ...modules,
            [module]: content
        }), {});

        let changes = await readUserCode(getBranchPath(branch));

        modules = {
            ...modules,
            ...changes
        };

        try {
            await this._api.updateUserCode({ branch, modules });
        } catch(err) {
            return;
        }

        const modulesView = await this.toModules(modules);

        this.state = { modules: modulesView };
    }

    async onRevertChanges(): Promise<void> {
        const {
            branch, modules
        }: {
            branch: string, modules: IModulesViewModules
        } = this.state;

        const entries = Object.entries(modules);

        for(let i = 0, l = entries.length; i < l; i++) {
            const [module, { content, modified }] = entries[i];

            if (!modified) {
                continue;
            }

            const modulePath = getModulePath(branch, module);
            const moduleFile = new File(modulePath);

            try {
                await moduleFile.write(content);
            } catch (err) {
                // Noop.
            }

            modules[module] = {
                content,
                modified: false
            };
        }

        this.state = { modules }
    }

    async onDidChange({ path }: { path: string }): Promise<void> {
        const module = getModuleByPath(path);

        if (!module) {
            return;
        }

        const file = new File(path);
        const content = await file.read();

        const { modules } = this.state;

        this.state = {
            modules: {
                ...modules,
                [module]: {
                    content: modules[module].content,
                    modified: modules[module].content !== content
                }
            }
        }
    }

    async open() {
        await atom.workspace.open(this, {
            searchAllPanes: true,
            activatePane: true,
            activateItem: true,
            split: 'down',
            location: 'left'
        });

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

        atom.project.onDidChangeFiles((events) => {
            events.forEach(({ path }) => this.onDidChange({ path }));
        });
    }

    async toModules(origin: IModules, changes: IModules = {}): Promise<IModulesViewModules> {
        const modules: IModulesViewModules = {};
        const entries = Object.entries(origin);

        for(let i = 0, l = entries.length; i < l; i++) {
            const [module, content] = entries[i];
            const _content = changes[module];

            const modified = !!(_content && _content !== content);

            modules[module] = {
                content,
                modified
            };
        }

        return modules;
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
