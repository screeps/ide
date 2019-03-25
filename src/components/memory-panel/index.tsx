// import { Panel, CompositeDisposable } from 'atom';
import { CompositeDisposable } from 'atom';

const pako = require('pako');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Observable, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import {
    MemoryView,
    PATH_BTN_REMOVE,
    PATH_BTN_DELETE,
    PATH_BTN_UPDATE,
    PATH_BTN_RELOAD,
    PATH_BTN_CANCEL
} from '../../../ui';
import { Service } from '../../service';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { getWatches, putWatches } from '../../utils';
import { User } from '../../services/user';
import { progress } from '../../decoratos';
import { getApi, getSocket, getUser } from '../../utils';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const MEMORY_URI = 'atom://screeps-ide/memory';

export class MemoryPanel {
    public element: HTMLElement;
    public viewRef = React.createRef<MemoryView>();

    private _memorySbj: Subject<IMemoryPath[]> = new Subject<IMemoryPath[]>();
    public memory$: Observable<IMemoryPath[]> = this._memorySbj.asObservable();

    private _tooltips: { [key: string]: CompositeDisposable } = {};
    private _tooltipsDisposables: CompositeDisposable | null = null;

    // @ts-ignore
    _pipe$: Subject<void> | null;

    public get state(): any {
        if (!this.viewRef.current) {
            return {
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
    private _user: User;
    // @ts-ignore
    private _api: Api;
    // @ts-ignore
    private _socket: Socket;
    // @ts-ignore
    private _service: Service;

    constructor(
        state: IMemoryViewState = {} as IMemoryViewState
    ) {
        this.element = document.createElement('div');
        this.render(state);

        setTimeout(() => {
            const pane = atom.workspace.paneForItem(this);

            if (!pane) {
                return;
            }

            pane.onDidDestroy(() => this.destroy());
        });

        (async () => {
            this._api = await getApi();
            this._user = await getUser();
            this._socket = getSocket();
            this._service = new Service()

            this.initMemoryPipeSubscription();

            this._service.shards$
                .pipe(tap((shards: any) => this.state = { shards }))
                .subscribe();
    
            const subscriptions = new CompositeDisposable();
            this.memory$
                .pipe(tap((memory: IMemoryPath[]) => this.state = { memory }))
                .pipe(tap(() => {
                    subscriptions.dispose();
                }))
                .pipe(tap((memory: IMemoryPath[]) => {
                    memory.forEach(({ path }) => {
                        const ref = document.getElementById(`${ PATH_BTN_REMOVE }${ path || 'root' }`);
    
                        if (!ref) {
                            return;
                        }
    
                        const disposable = atom.tooltips.add(ref, {
                            title: 'Delete watch'
                        });
    
                        subscriptions.add(disposable);
                    });
                }))
                .subscribe();
    
            this._applyTooltips();
        })()
    }

    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.next();
            this._pipe$.complete();
            this._pipe$ = null;
        }

        this._pipe$ = new Subject();

        const { shard, memory }: { shard: string, memory: IMemoryPath[] } = this.state;
        const paths$ = memory.map(({ path }) => {
            return this._socket.on(`user:${ this._user.id }/memory/${ shard }/${ path }`);
        });
        const pipe$: any = merge(...paths$);

        pipe$
            .pipe(takeUntil(this._pipe$))
            .pipe(tap(({ data: [channel, value] }: { data: any }) => {
                const [, , , _path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);

                const memory: IMemoryPath[] = this.state.memory;
                const path = memory.find(({ path }) => path === _path);

                if (!path || path.value === value) {
                    return;
                }

                // Check value for undefined, if undefined return
                if (path.value && path.value.toString() === value) {
                    return;
                }

                const idx = this.state.memory.indexOf(path);
                memory[idx] =  { ...path, value };
                this._memorySbj.next([ ...memory ]);
            }))
            .subscribe(undefined, undefined, () => {
                memory.forEach(({ path }) => {
                    this._socket.off(`user:${ this._user.id }/memory/${ shard }/${ path }`);
                });
            });
    }

    render({
        shard = 'shard0',
        memory = getWatches(),
        segment = '0'
    }) {
        ReactDOM.render(
            <MemoryView ref={ this.viewRef }
                onInput={ this.onInput }
                onClose={ this.onClose }

                shard={ shard }
                onShard={ () => this.onShard() }

                memory={ memory }
                onMemory={ (...args) => this.onMemory(...args) }
                onMemoryRefresh={ (...args) => this.onMemory(...args) }
                onMemoryRemove={ (...args) => this.onMemoryRemove(...args) }
                onMemoryDelete={ (...args) => this.onMemoryDelete(...args) }
                onMemoryUpdate={ (...args) => this.onMemoryUpdate(...args) }
                onMemoryCancel={ (...args) => this.onMemoryCancel(...args) }

                segment={ segment }
                onSegment={ (...args) => this.onSegment(...args) }
                onSegmentRefresh={ (...args) => this.onSegment(...args) }
                onSegmentUpdate={ (...args) => this.onSegmentUpdate(...args) }
            />,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    onInput = (path: string) => {
        const memory = [...this.state.memory, { path } as IMemoryPath];
        this._memorySbj.next(memory);

        putWatches(memory);
        this.initMemoryPipeSubscription();
    }

    onClose = () => {
        this.destroy();
    }

    onShard = async (): Promise<void> => {
        this.initMemoryPipeSubscription();
    }

    @progress
    async onMemory(path: string, shard: string): Promise<void> {
        let response: IUserMemoryResponse;
        try {
            response = await this._api.getUserMemory({ path, shard });
        } catch (err) {
            return;
        }

        let value;
        if (response.data) {
            value = JSON.parse(pako.ungzip(atob(response.data.substring(3)), {to: 'string'}));
        }

        const memory = this.state.memory;
        const idx = memory.findIndex((item: any) => item.path === path);

        if (idx === -1) {
            return;
        }

        memory[idx] = { path, value };
        this._memorySbj.next([ ...memory ]);

        setTimeout(() => {
            if (this._tooltips[path]) {
                this.onMemoryCancel(path);
            }

            const subscriptions = this._tooltips[path] = new CompositeDisposable();

            let ref = document.getElementById(`${ PATH_BTN_DELETE }${ path || 'root' }`);

            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Delete from memory' });
                subscriptions.add(disposable);
            }

            ref = document.getElementById(`${ PATH_BTN_UPDATE }${ path || 'root' }`);

            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Save' });
                subscriptions.add(disposable);
            }

            ref = document.getElementById(`${ PATH_BTN_RELOAD }${ path || 'root' }`);

            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Reload' });
                subscriptions.add(disposable);
            }

            ref = document.getElementById(`${ PATH_BTN_CANCEL }${ path || 'root' }`);

            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Cancel changes' });
                subscriptions.add(disposable);
            }
        });
    }

    @progress
    async onMemoryUpdate(path: string, value: any, shard: string): Promise<void> {
        try {
            await this._api.setUserMemory({ path, value, shard });
        } catch (err) {
            return;
        }

        const memory = this.state.memory;
        const idx = memory.findIndex((item: any) => item.path === path);

        if (idx === -1) {
            return;
        }

        memory[idx] = { path, value };
        this._memorySbj.next([ ...memory ]);
    }

    @progress
    async onMemoryRemove(path: string, shard: string): Promise<void> {
        try {
            await this._api.setUserMemory({ path, shard });
        } catch (err) {
            return;
        }
    }

    @progress
    async onMemoryDelete(path: string): Promise<void> {
        const memory = this.state.memory;
        const idx = memory.findIndex((item: any) => item.path === path);

        if (idx === -1) {
            return;
        }

        memory.splice(idx, 1);
        this._memorySbj.next([ ...memory ]);

        putWatches(memory);
        this.initMemoryPipeSubscription();
    }

    async onMemoryCancel(path: string): Promise<void> {
        this._tooltips[path].dispose();
        delete this._tooltips[path];
    }

    @progress
    async onSegment(segment: string, shard: string): Promise<void> {
        let response: IUserMemorySegmentResponse;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard });
        } catch (err) {
            return;
        }

        this.state = {
            segmentData: response.data,
            _segmentData: response.data,
            segmentHasChange: false
        };
    }

    @progress
    async onSegmentUpdate(segment: string, data: string, shard: string): Promise<void> {
        try {
            await this._api.setUserMemorySegment({ segment, data, shard });
        } catch (err) {
            return;
        }

        this.state = {
            segmentData: data,
            _segmentData: data,
            segmentHasChange: false
        };
    }

    private _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }

            this._tooltipsDisposables = new CompositeDisposable();

            const showMainMemoryBtnRef = document.getElementById('screeps-memory__control-main');
            if (showMainMemoryBtnRef) {
                const disposable = atom.tooltips.add(showMainMemoryBtnRef, { title: 'Main memory' });
                this._tooltipsDisposables.add(disposable);
            }

            const showSegmentsMemoryBtnRef = document.getElementById('screeps-memory__control-segments');
            if (showSegmentsMemoryBtnRef) {
                const disposable = atom.tooltips.add(showSegmentsMemoryBtnRef, { title: 'Segments memory' });
                this._tooltipsDisposables.add(disposable);
            }

            const closeMemoryBtnRef = document.getElementById('screeps-memory__control-close');
            if (closeMemoryBtnRef) {
                const disposable = atom.tooltips.add(closeMemoryBtnRef, { title: 'Close panel' });
                this._tooltipsDisposables.add(disposable);
            }
        });
    }

    destroy() {
        if (this._pipe$) {
            this._pipe$.next();
            this._pipe$.complete();
            this._pipe$ = null;
        }

        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }
    }

    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'MemoryPanel',
            state: this.state
        }
    }

    static deserialize({ state }: { state: any }) {
        return new MemoryPanel(state);
    }

    // Atom pane required interface's methods
    getURI() {
        return MEMORY_URI;
    }

    getTitle() {
        return 'Memory';
    }

    // isPermanentDockItem() {
    //     return true;
    // }

    getAllowedLocations() {
        return ['bottom', 'top'];
    }
}