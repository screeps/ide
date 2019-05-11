"use strict";
// const fs = require('fs');
// import { File, TextEditor, ViewModel } from 'atom';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { Subject, Observable } from 'rxjs';
// import { tap, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
// import { default as __state } from '../../state';
// import { ModulesView } from '../../../ui';
// import { default as confirm } from '../confirm-modal';
// import { Api } from '../../api';
// import { progress } from '../../decoratos';
// import {
//     // isProjectExist,
//     getModulePath,
//     getModuleByPath,
//     getBranchPath, 
//     readUserCode,
//     getApi, getUser,
//     combineModules
// } from '../../utils';
// import {
//     commitAll,
//     revertAll,
//     copyBranch
// } from '../../commands';
// export const ACTION_CLOSE = 'ACTION_CLOSE';
// export const MODULES_URI = 'atom://screeps-ide/modules';
// export class ModulesPane implements ViewModel {
//     public element: HTMLElement;
//     public viewRef = React.createRef<ModulesView>();
//     _destroySbj: Subject<null> = new Subject();
//     _destroy$: Observable<null> = this._destroySbj.asObservable();
//     public get state(): any {
//         if (!this.viewRef.current) {
//             return {
//                 branch: 'default',
//                 modules: {}
//             };
//         }
//         return this.viewRef.current.state;
//     }
//     public set state(state: any) {
//         if (!this.viewRef.current) {
//             return;
//         }
//         this.viewRef.current.state = {
//             ...this.viewRef.current.state,
//             ...state
//         };
//         this.viewRef.current.setState(
//             this.viewRef.current.state
//         );
//     }
//     // @ts-ignore
//     private _api: Api;
//     constructor(
//         state: IModulesViewState = {} as IModulesViewState
//     ) {
//         this.element = document.createElement('div');
//         this.render(state);
//         // atom.project.onDidChangeFiles((events) => {
//         //     events.forEach(({ path }) => this.onDidChange({ path }));
//         // });
//         setTimeout(() => {
//             const pane = atom.workspace.paneForItem(this);
//             if (!pane) {
//                 return;
//             }
//             pane.onDidDestroy(() => this.destroy());
//         });
//         atom.workspace.onDidChangeActivePaneItem((pane) => {
//             if (!(pane instanceof TextEditor)) {
//                 return;
//             }
//             const path = pane.getPath() as string;
//             this.onDidChangeActivePaneItem({ path });
//         });
//         (async () => {
//             try {
//                 const api = await getApi();
//                 await getUser();
//                 this._api = api;
//                 // TODO: need to destory subscribtion
//                 __state
//                     .pipe(takeUntil(this._destroy$))
//                     .pipe(map(({ branch }) => branch))
//                     .pipe(distinctUntilChanged())
//                     .pipe(tap((branch) => this.onSelectBranch(branch)))
//                     .pipe(tap((branch) => this.state = { branch }))
//                     .subscribe();
//                 __state
//                     .pipe(takeUntil(this._destroy$))
//                     .pipe(map(({ modules }) => modules))
//                     .pipe(distinctUntilChanged())
//                     .pipe(tap((modules) => this.state = { modules }))
//                     .subscribe();
//                 __state
//                     .pipe(takeUntil(this._destroy$))
//                     .pipe(map(({ branches }) => branches))
//                     .pipe(distinctUntilChanged())
//                     .pipe(tap((branches) => this.state = { branches }))
//                     .subscribe();
//             } catch (err) {
//                 setTimeout(() => {
//                     const pane = atom.workspace.paneForItem(this);
//                     if (!pane) {
//                         return;
//                     }
//                     pane.destroyItem(this);
//                 });
//                 this.destroy();
//             }
//         })()
//     }
//     render({ modules = {}, branch = '', branches = [] }: IModulesViewState) {
//         ReactDOM.render(
//             <div>
//                 <ModulesView ref={ this.viewRef }
//                     branch={ branch }
//                     branches={ branches }
//                     modules={ modules }
//                     onChooseModules={() => this.onChooseModules()}
//                     onChooseBranches={() => this.onChooseBranches()}
//                     onCopyBranch={(...args) => this.onCopyBranch(...args)}
//                     onSelectBranch={(...args) => this.onSelectBranch(...args)}
//                     onDeleteBranch={(...args) => this.onDeleteBranch(...args)}
//                     onCreateModule={(...args) => this.onCreateModule(...args)}
//                     onSelectModule={(...args) => this.onSelectModule(...args)}
//                     onDeleteModule={(...args) => this.onDeleteModule(...args)}
//                     onApplyChanges={() => this.onApplyChanges()}
//                     onRevertChanges={() => this.onRevertChanges()}
//                 />
//             </div>,
//             this.element as HTMLElement
//         )
//     }
//     async onChooseModules(): Promise<void> {
//     }
//     @progress
//     async onChooseBranches(): Promise<void> {
//         const { list: branches } = await this._api.getUserBranches();
//         this.state = { branches };
//     }
//     @progress
//     async onCopyBranch(branch: string): Promise<void> {
//         try {
//             await copyBranch(branch)
//         } catch(err) {
//             console.error(err);
//         }
//     }
//     @progress
//     async onSelectBranch(_branch?: string): Promise<void> {
//         const { branch, modules: _modules } = await this._api.getUserCode(_branch);
//         const changes = await readUserCode(getBranchPath(branch));
//         const files = Object.entries(changes)
//             .reduce((acc, [name]) => ({ ...acc, [name]: null }), {});
//         const modules = combineModules({
//             ...files,
//             ..._modules
//         }, changes);
//         __state.next({
//             ...__state.getValue(),
//             branch,
//             modules
//         });
//     }
//     async onDeleteBranch(branch: string): Promise<void> {
//         try {
//             await confirm({
//                 submitBtn: 'Delete',
//                 legend: 'This action cannot be undone! Are you sure?'
//             });
//             await this._api.deleteUserBranch(branch);
//             this.onChooseBranches();
//         } catch(err) {
//             // Ignore.
//         }
//     }
//     async onCreateModule(module: string): Promise<void> {
//         const { modules } = this.state;
//         this.state = {
//             modules: {
//                 ...modules,
//                 [module]: {
//                     content: null,
//                     modified: true
//                 }
//             }
//         }
//         this.onSelectModule(module);
//     }
//     async onSelectModule(module: string): Promise<void> {
//         const { branch, modules } = this.state;
//         // @ts-ignore
//         const modulePath = getModulePath(branch, module);
//         const moduleFile = new File(modulePath);
//         const isExist = await moduleFile.exists();
//         const content = modules[module].content || '';
//         if (!isExist) {
//             await moduleFile.create();
//             await moduleFile.write(content);
//         }
//         // let isTextEditor = 
//         // atom.workspace.getTextEditors()
//         //     .find((textEditor) => textEditor.getPath() === moduleFile.getPath());
//         // let textEditor = 
//         await atom.workspace.open(moduleFile.getPath(), {
//             searchAllPanes: true
//         }) as TextEditor;
//         // if (isTextEditor) {
//         //     return;
//         // }
//         // textEditor.onDidSave(({ path }) => {
//         //     this.onDidChange({ path })
//         // });
//     }
//     async onDeleteModule(module: string): Promise<void> {
//         const { branch, modules } = this.state;
//         __state.next({
//             ...__state.getValue(),
//             modules: {
//                 ...modules,
//                 [module]: {
//                     ...modules[module],
//                     deleted: true
//                 }
//             }
//         });
//         const modulePath = getModulePath(branch, module);
//         try {
//             fs.unlink(modulePath, () => {})
//         } catch (err) {
//             // Noop.
//         }
//     }
//     @progress
//     async onApplyChanges(): Promise<void> {
//         commitAll();
//     }
//     async onRevertChanges(): Promise<void> {
//         revertAll();
//     }
//     async onDidChangeActivePaneItem({ path }: { path: string }): Promise<void> {
//         const module = getModuleByPath(path);
//         if (!module) {
//             return;
//         }
//         let { modules } = this.state;
//         modules = Object.entries(modules).reduce((modules, [_module, data]) => ({
//             ...modules,
//             [_module]: {
//                 ...data,
//                 active: module === _module 
//             }
//         }), {})
//         this.state = { modules };
//     }
//     destroy() {
//         this._destroySbj.next();
//         this._destroySbj.complete();
//     }
//     // Implement serialization hook for view model
//     serialize() {
//         return {
//             deserializer: 'ModulesPane',
//             state: this.state
//         }
//     }
//     static deserialize({ state }: { state: IModulesViewState }) {
//         return new ModulesPane(state);
//     }
//     // Atom pane required interface's methods
//     getURI() {
//         return MODULES_URI;
//     }
//     getTitle() {
//         return 'Modules';
//     }
//     getDefaultLocation() {
//         'left';
//     }
//     getAllowedLocations() {
//         return ['left', 'right'];
//     }
// }
//# sourceMappingURL=index.js.map