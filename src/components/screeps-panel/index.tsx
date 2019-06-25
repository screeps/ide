import { ViewModel, TextEditor } from 'atom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import pako from 'pako';
import { tap, distinctUntilChanged } from 'rxjs/operators';

import {
    getApi, getUser, getSocket
} from '../../utils';
import { default as __state } from '../../state';
import { Socket } from '../../socket';

import { BranchesBlock } from '../branches-block';
import { ModulesBlock } from '../modules-block';
import { CONSOLE_URI } from '../console-panel';
import { MEMORY_URI } from '../memory-panel';

import { UpdateModulesAction } from './actions';

import './reducers';
import * as effects from './effects';
import { default as store } from '../../store';
import { CreateProjectAction } from '../../store/actions';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const SCREEPS_URI = 'atom://screeps-ide/screeps';

export class ScreepsPanel implements ViewModel {
    public element: HTMLElement;

    _user: any = null;
    _socket: Socket | null = null;

    constructor(
        public state: IState = __state.getValue()
    ) {
        this.element = document.createElement('div');

        Object.values(effects).forEach((effect) => effect.subscribe());

        __state
            .pipe(distinctUntilChanged())
            .pipe(tap((state) => this.render(state)))
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

        // TODO: тут надо сделать выставление статуса активный модуль
        atom.workspace.onDidChangeActivePaneItem((pane) => {
            if (!(pane instanceof TextEditor)) {
                return;
            }

            // @ts-ignore
            // console.log(pane.getPath());

            // const path = pane.getPath() as string;
            // store.dispatch(ActiveModule())
        });
    }

    render({ branch, branches, modules }: IState) {
        const _modules = modules[branch];

        let modulesView;
        if (_modules) {
            modulesView = (<ModulesBlock branch={ branch } modules={ _modules } />);
        }

        ReactDOM.render(
            <div className='screeps-ide screeps-panel'>
                <BranchesBlock branch={ branch } branches={ branches } />
                { modulesView }
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

    static deserialize({ state }: { state: IState }) {
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