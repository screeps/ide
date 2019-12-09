import { ViewModel, TextEditor, CompositeDisposable } from 'atom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import pako from 'pako';
import { tap, filter, distinctUntilChanged } from 'rxjs/operators';

import {
    getApi, getUser, getSocket,
    applyTooltip
} from '../../utils';
import { default as __state } from '../../state';
import { Socket } from '../../socket';

import {
    BTN_BRANCHES_CLONE,
    BTN_BRANCHES_DELETE
} from '../../../ui';
import { BranchesBlock } from '../branches-block';
import { ModulesBlock } from '../modules-block';
import { CONSOLE_URI } from '../console-panel';
import { MEMORY_URI } from '../memory-panel';
import { default as ResizablePanel } from '../../../ui/components/resizable-panel';

import './reducers';
import {
    SetActiveModule,
    UpdateModulesAction,
    UpdateBranchesAction
} from './actions';
import { default as store } from '../../store';
import { CreateProjectAction } from '../../store/actions';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const SCREEPS_URI = 'atom://screeps-ide/screeps';

let subscriptions = new CompositeDisposable();

export interface IScreepsPanelState {
    branch?: string;
    branches?: IBranch[];
    branchesBlockHeight?: number;

    modules?: {
        [key: string]: IModules;
    },

    activeBranchTextEditor?: string;
    activeModuleTextEditor?: string;
}

export class ScreepsPanel implements ViewModel {
    public element: HTMLElement;

    _user: any = null;
    _socket: Socket | null = null;

    private _state: IScreepsPanelState = {
        branch: 'default',
        branches: [],
        modules: {}
    };

    public get state(): any {
        return this._state;
    }

    public set state(state: any) {
        this._state = {
            ...this._state,
            ...state
        };

        this.render(this.state);
    }

    constructor(
        state: IScreepsPanelState = {}
    ) {
        this.element = document.createElement('div');
        this.state = state;

        __state
            .pipe(distinctUntilChanged())
            .pipe(tap((state) => this.state = state))
            .pipe(filter(({ branches }) => !!(branches && branches.length)))
            .pipe(tap(({ branches }) => {
                subscriptions.dispose();
                subscriptions = new CompositeDisposable();

                for (let { _id } of branches) {
                    let d;
                    d = applyTooltip(`#${ BTN_BRANCHES_CLONE }-${ _id }`, 'Clone branch', this.element);
                    d && subscriptions.add(d);
                    d = applyTooltip(`#${ BTN_BRANCHES_DELETE }-${ _id }`, 'Delete branch', this.element);
                    d && subscriptions.add(d);
                }
            }))
            .subscribe();

        (async () => {
            try {
                const _api = await getApi();
                this._user = await getUser();
                this._socket = getSocket();

                this._socket.on(`user:${ this._user.id }/code`)
                    .pipe(tap(({ data: [, { branch, modules }] }) => {
                        store.dispatch(UpdateModulesAction(branch, modules));
                    }))
                    .pipe(filter(({ data: [, { branch }]}) => {
                        const state = __state.getValue();
                        if (!state || !state.branches) {
                            return false;
                        }

                        const _branch = state.branches.find(({ branch: _ }) => _ === branch);
                        if (_branch) {
                            return false;
                        }

                        return true;
                    }))
                    .pipe(tap(async () => {
                        const { list } = await _api.getUserBranches();
                        store.dispatch(UpdateBranchesAction(list))
                    }))
                    .subscribe();

                const { list: branches } = await _api.getUserBranches();

                // Тут второй раз срабатывает next
                __state.next({
                    ...__state.getValue(),
                    branches
                });
            } catch (err) {
                console.log(err);
                setTimeout(() => destroy(this));
                this.destroy();
            }
        })()

        atom.workspace.getCenter().onDidChangeActivePaneItem((pane) => {
            let branch = null;
            let module = null;

            if (pane instanceof TextEditor) {
                const path = pane.getPath() as string;
                const matches = /[\\\/]\.branches[\\\/]([^\\]+)[\\\/]([^\\]+)\.js/.exec(path);

                if (matches) {
                    [, branch, module] = matches;
                }
            }

            store.dispatch(SetActiveModule(branch, module));
        });
    }

    render({
        branch = '',
        branches = [],
        branchesBlockHeight,
        modules = {},
        activeBranchTextEditor,
        activeModuleTextEditor
    }: IScreepsPanelState) {
        const _modules = modules[branch];

        let modulesView;
        if (_modules) {
            modulesView = (<ModulesBlock
                branch={ branch }
                modules={ _modules }

                active={ `@${ activeBranchTextEditor }/${ activeModuleTextEditor }`}
            />);
        }

        ReactDOM.render(
            <div className='screeps-ide screeps-panel'>
                <ResizablePanel
                    height={ branchesBlockHeight }

                    onChangeHeight={ (branchesBlockHeight) => this.state = { branchesBlockHeight } }
                >
                    <BranchesBlock
                        branch={ branch }
                        branches={ branches }

                        active={ activeBranchTextEditor }
                    />
                </ResizablePanel>
                { modulesView }
                <footer>
                    <button className='btn btn-primary' onClick={ this.createProject }>
                        Create New Project
                    </button>
                    <div>
                        <button className='btn' onClick={ this.openMemoryPanel } >
                            Memory
                        </button>
                        <button className='btn' onClick={ this.openConsolePanel } >
                            Console
                        </button>
                    </div>
                </footer>
            </div>,
            this.element as HTMLElement
        )
    }

    createProject() {
        store.dispatch(CreateProjectAction());
    }

    openMemoryPanel() {
        atom.workspace.open(MEMORY_URI, {
            activatePane: true,
            activateItem: true,
            // split: 'down',
            location: 'bottom'
        });
    }

    openConsolePanel() {
        atom.workspace.open(CONSOLE_URI, {
            activatePane: true,
            activateItem: true,
            // split: 'down',
            location: 'bottom'
        });
    }

    destroy() {
        if (this._socket && this._user) {
            this._socket.on(`user:${ this._user.id }/code`)
        }
    }

    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ScreepsPanel',
            state: this.state
        }
    }

    static deserialize({ state }: { state: IScreepsPanelState }) {
        return new ScreepsPanel(state);
    }

    // Atom view model required interface's methods
    getURI() {
        return SCREEPS_URI;
    }

    getTitle() {
        return 'Screeps';
    }

    getDefaultLocation() {
        'left';
    }

    getAllowedLocations() {
        return ['left', 'right'];
    }
}

function destroy(item: ViewModel) {
    const pane = atom.workspace.paneForItem(item);

    if (!pane) {
        return;
    }

    pane.destroyItem(item);
}