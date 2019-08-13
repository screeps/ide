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
    PATH_BTN_CANCEL,
    BTN_SEGMENTS_SAVE,
    BTN_SEGMENTS_RELOAD,
    MEMORY_MAIN_VIEW,
    MEMORY_SEGMENTS_VIEW
} from '../../../ui';
import { Service } from '../../service';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { guid, getWatches, putWatches } from '../../utils';
import { User } from '../../services/user';
import { progress } from '../../decoratos';
import { getApi, getSocket, getUser, applyTooltip } from '../../utils';
import { default as confirm } from '../confirm-modal';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const MEMORY_URI = 'atom://screeps-ide/memory';

const DEFAULT_SEGMENT = '0';

export class MemoryPanel {
    public element: HTMLElement;

    private _memorySbj: Subject<IMemoryPath[]> = new Subject<IMemoryPath[]>();
    public memory$: Observable<IMemoryPath[]> = this._memorySbj.asObservable();

    private _tooltips: { [key: string]: CompositeDisposable } = {};
    private _tooltipsDisposables: CompositeDisposable | null = null;
    private _segmentsTooltipsDisposables: CompositeDisposable | null = null;

    // @ts-ignore
    _pipe$: Subject<void> | null;

    private _state = {
        view: MEMORY_MAIN_VIEW,
        memory: getWatches()
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

    // @ts-ignore
    private _user: User;
    // @ts-ignore
    private _api: Api;
    // @ts-ignore
    private _socket: Socket;
    // @ts-ignore
    private _service: Service;

    constructor(
        state: any = {}
    ) {
        this.element = document.createElement('div');
        delete state.memory;
        this.state = state;

        setTimeout(() => {
            const pane = atom.workspace.paneForItem(this);

            if (!pane) {
                return;
            }

            pane.onDidDestroy(() => this.destroy());
        });

        (async () => {
            try {
                this._api = await getApi();
                this._user = await getUser();
                this._socket = getSocket();
                this._service = new Service();

                this.state = { shard: this._user.shard };

                this.onChangeView(this.state.view);

                this._service.shards$
                    .pipe(tap((shards: any) => this.state = { shards }))
                    .subscribe();

                let subscriptions = new CompositeDisposable();
                this.memory$
                    .pipe(tap((memory: IMemoryPath[]) => this.state = { memory }))
                    .pipe(tap(() => {
                        subscriptions.dispose();
                        subscriptions = new CompositeDisposable();
                    }))
                    .pipe(tap((memory: IMemoryPath[]) => {
                        memory.forEach(({ _id }) => {
                            const d = applyTooltip(`#${ PATH_BTN_REMOVE }${ _id }`, 'Remove watch');
                            d && subscriptions.add(d);
                        });
                    }))
                    .subscribe();

                this._applyTooltips();
            } catch (err) {
                setTimeout(() => {
                    const pane = atom.workspace.paneForItem(this);

                    if (!pane) {
                        return;
                    }

                    pane.destroyItem(this);
                });

                this.destroy();
            }
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
        view = MEMORY_MAIN_VIEW,
        shard = 'shard0',
        shards = [],
        memory = [],
        segment = DEFAULT_SEGMENT,
        segmentData = '',
        isProgressing = false
    }) {
        ReactDOM.render(
            <MemoryView
                view={ view }
                onChangeView={ (view) => this.onChangeView(view) }
                isProgressing={ isProgressing }

                onInput={ this.onInput }
                onClose={ this.onClose }

                shard={ shard }
                shards={ shards }
                onShard={ (shard) => this.onShard(shard) }

                memory={ memory }
                onMemory={ (...args) => this.onMemory(...args) }
                onMemoryReload={ (...args) => this.onMemory(...args) }
                onMemoryRemove={ (...args) => this.onMemoryRemove(...args) }
                onMemoryDelete={ (...args) => this.onMemoryDelete(...args) }
                onMemoryUpdate={ (...args) => this.onMemoryUpdate(...args) }
                onMemoryCancel={ (...args) => this.onMemoryCancel(...args) }

                segment={ segment }
                segmentData={ segmentData }
                onSegment={ (...args) => this.onSegment(...args) }
                onSegmentRefresh={ (...args) => this.onSegment(...args) }
                onSegmentUpdate={ (...args) => this.onSegmentUpdate(...args) }
            />,
            this.element as HTMLElement
        )
    }

    onChangeView = (view: string) => {
        this.state = { view }

        switch(this.state.view) {
            case MEMORY_MAIN_VIEW: {
                this.initMemoryPipeSubscription();

                break;
            }
            case MEMORY_SEGMENTS_VIEW: {
                setTimeout(() => {
                    if (this._segmentsTooltipsDisposables) {
                        this._segmentsTooltipsDisposables.dispose();
                    }

                    let d;
                    const subscriptions = this._segmentsTooltipsDisposables = new CompositeDisposable();

                    d = applyTooltip(`#${ BTN_SEGMENTS_SAVE }`, 'Save');
                    d && subscriptions.add(d);
                    d = applyTooltip(`#${ BTN_SEGMENTS_RELOAD }`, 'Reload');
                    d && subscriptions.add(d);
                });

                this.onSegment(this.state.segment, this.state.shard);

                break;
            }
        }
    }

    // Private component actions.
    onInput = (path: string) => {
        let { memory } = this.state;

        const isExist = memory.some((_: IMemoryPath) => _.path === path);
        if (isExist) {
            return;
        }

        memory = [...memory, { _id: guid(), path } as IMemoryPath];
        this._memorySbj.next(memory);

        putWatches(memory);
        this.initMemoryPipeSubscription();
    }

    onClose = () => {
        this.destroy();
    }

    onShard = async (shard: string): Promise<void> => {
        this.state = { shard };

        this.onChangeView(this.state.view);
    }

    @progress
    async onMemory(path: string, shard: string): Promise<any> {
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

        memory[idx] = { ...memory[idx], value };
        this._memorySbj.next([ ...memory ]);

        setTimeout(() => {
            if (this._tooltips[path]) {
                this.onMemoryCancel(path);
            }

            let d;
            const subscriptions = this._tooltips[path] = new CompositeDisposable();
            const _id = memory[idx]._id;

            d = applyTooltip(`#${ PATH_BTN_DELETE }${ _id }`, 'Delete from memory');
            d && subscriptions.add(d);
            d = applyTooltip(`#${ PATH_BTN_UPDATE }${ _id }`, 'Save');
            d && subscriptions.add(d);
            d = applyTooltip(`#${ PATH_BTN_RELOAD }${ _id }`, 'Reload');
            d && subscriptions.add(d);
            d = applyTooltip(`#${ PATH_BTN_CANCEL }${ _id }`, 'Cancel changes');
            d && subscriptions.add(d);
        });

        return value;
    }

    @progress
    async onMemoryUpdate(path: string, value: any, shard: string): Promise<void> {
        if (!path) {
            try {
                await confirm({
                    legend: 'You are going to rewrite the entire Memory tree. Doing so is not recommended and could result in replacing some of your variables that are already changed with an obsolete state. It is better to create a watch for a specific sub-tree and commit it instead.\n\nDo you really want to proceed?'
                });
            } catch (err) {
                throw err;
            }
        }

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

        memory[idx] = { ...memory[idx], value };
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
    async onSegment(segment: string = DEFAULT_SEGMENT, shard: string): Promise<void> {
        this.state = {
            segment
        };

        let response: IUserMemorySegmentResponse;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard });
        } catch (err) {
            return;
        }

        this.state = {
            segmentData: response.data
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
            segmentData: data
        };
    }

    private _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }

            let d;
            const subscriptions = this._tooltipsDisposables = new CompositeDisposable();

            d = applyTooltip('#screeps-memory__control-main', 'Main memory', this.element);
            d && subscriptions.add(d);
            d = applyTooltip('#screeps-memory__control-segments', 'Segments', this.element);
            d && subscriptions.add(d);
            d = applyTooltip('#screeps-memory__control-close', 'Close panel', this.element);
            d && subscriptions.add(d);
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

    getAllowedLocations() {
        return ['bottom', 'top'];
    }
}