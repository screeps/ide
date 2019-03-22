const fs = require('fs');
import { File, TextEditor, ViewModel } from 'atom';
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
    readUserCode,
    getApi, getUser 
} from '../../utils';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const MODULES_URI = 'atom://screeps-ide/modules';

export class ModulesPane implements ViewModel {
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

        this.viewRef.current.state = {
            ...this.viewRef.current.state,
            ...state
        };

        this.viewRef.current.setState(
            this.viewRef.current.state
        );
    }

    // @ts-ignore
    private _api: Api;

    constructor(
        state: IModulesViewState = {} as IModulesViewState
    ) {
        console.log('create', MODULES_URI);

        this.element = document.createElement('div');
        this.render(state);

        // this.open();

        atom.project.onDidChangeFiles((events) => {
            events.forEach(({ path }) => this.onDidChange({ path }));
        });

        atom.workspace.onDidChangeActivePaneItem((pane) => {
            if (!(pane instanceof TextEditor)) {
                return;
            }

            const path = pane.getPath() as string;
            this.onDidChangeActivePaneItem({ path });
        });

        (async () => {
            const api = await getApi();
            await getUser();
            this._api = api;
            this.onSelectBranch(state.branch);
        })()
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

                    onCreateModule={(...args) => this.onCreateModule(...args)}
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

    async onCreateModule(module: string): Promise<void> {
        const { modules } = this.state;

        this.state = {
            modules: {
                ...modules,
                [module]: {
                    content: null,
                    modified: true
                }
            }
        }

        this.onSelectModule(module);
    }

    async onSelectModule(module: string): Promise<void> {
        const { branch, modules } = this.state;

        // @ts-ignore
        const modulePath = getModulePath(branch, module);
        const moduleFile = new File(modulePath);
        const isExist = await moduleFile.exists();
        const content = modules[module].content || '';

        if (!isExist) {
            await moduleFile.create();
            await moduleFile.write(content);
        }

        let isTextEditor = atom.workspace.getTextEditors()
            .find((textEditor) => textEditor.getPath() === moduleFile.getPath());

        let textEditor = await atom.workspace.open(moduleFile.getPath(), {
            searchAllPanes: true
        }) as TextEditor;

        if (isTextEditor) {
            return;
        }

        textEditor.onDidSave(({ path }) => {
            this.onDidChange({ path })
        });

    }

    async onDeleteModule(module: string): Promise<void> {
        const { branch, modules } = this.state;

        this.state = {
            modules: {
                ...modules,
                [module]: {
                    ...modules[module],
                    deleted: true
                }
            }
        }

        const modulePath = getModulePath(branch, module);

        try {
            fs.unlink(modulePath, () => {})
        } catch (err) {
            // Noop.
        }
    }

    @progress
    async onApplyChanges(): Promise<void> {
        const {
            branch, modules: _modules
        }: {
            branch: string, modules: IModulesViewModules
        } = this.state;

        let modules: IModules = Object.entries(_modules)
            .filter(([, { deleted }]) => !deleted)
            .reduce((modules, [module, { content }]) => ({
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
            const [module, { content, modified, deleted }] = entries[i];

            if (!modified && !deleted) {
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
        let content;
        try {
            content = await file.read();
        } catch (err) {
            return;
        }

        const { modules } = this.state;

        let _module = modules[module];

        if (_module) {
            _module = {
                content: _module.content,
                modified: _module.content !== content,
                deleted: _module.deleted
            }
        } else {
            _module = {
                content: null,
                modified: true,
                deleted: false
            }
        }

        this.state = {
            modules: {
                ...modules,
                [module]: _module
            }
        }
    }

    async onDidChangeActivePaneItem({ path }: { path: string }): Promise<void> {
        const module = getModuleByPath(path);

        if (!module) {
            return;
        }

        let { modules } = this.state;

        modules = Object.entries(modules).reduce((modules, [_module, data]) => ({
            ...modules,
            [_module]: {
                ...data,
                active: module === _module 
            }
        }), {})

        this.state = { modules };
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

    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ModulesPane',
            state: this.state
        }
    }

    static deserialize({ state }: { state: IModulesViewState }) {
        return new ModulesPane(state);
    }

    // Atom pane required interface's methods
    getURI() {
        return MODULES_URI;
    }

    getTitle() {
        return 'Modules';
    }

    getDefaultLocation() {
        'left';
    }

    getAllowedLocations() {
        return ['left', 'right'];
    }
}
