import { Panel, CompositeDisposable } from 'atom';

const pako = require('pako');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subscription, Observable, Subject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
    MemoryView,
    ResizablePanel,
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

export class MemoryPane {
    public element: HTMLElement;
    private _panel: Panel;

    public memoryViewRef = React.createRef<MemoryView>();
    private _memorySbj: Subject<IMemoryPath[]> = new Subject<IMemoryPath[]>();
    public memory$: Observable<IMemoryPath[]> = this._memorySbj.asObservable();

    private _tooltips: { [key: string]: CompositeDisposable } = {};

    _pipe$: Subscription | null = null;

    constructor(
        private _user: User,
        private _api: Api,
        private _socket: Socket,
        private _service: Service
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '300px';

        this.render({
            shard: this._user.shard,
            memory: getWatches(),
            segment: '0'
        });

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });

        this.initMemoryPipeSubscription();

        this._service.shards$
            .pipe(tap((shards: any) => {
                if (!this.memoryViewRef.current) {
                    return;
                }

                this.memoryViewRef.current.setState({
                    ...this.memoryViewRef.current.state,
                    shards
                });
            }))
            .subscribe();

        const subscriptions = new CompositeDisposable();
        this.memory$
            .pipe(tap((memory: IMemoryPath[]) => {
                if (!this.memoryViewRef.current) {
                    return;
                }

                this.memoryViewRef.current.setState({
                    ...this.memoryViewRef.current.state,
                    memory
                });
            }))
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
    }

    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }

        if (!this.memoryViewRef.current) {
            return;
        }

        const state = this.memoryViewRef.current.state;

        const memory: IMemoryPath[] = getWatches();
        const paths$: any = [];

        memory.forEach(({ path }) => {
            const pipe = this._socket.on(`user:${ this._user.id }/memory/${ state.shard }/${ path }`);
            paths$.push(pipe);
        });

        const pipe$: any = merge(...paths$);

        this._pipe$ = pipe$.subscribe(({ data: [channel, value] }: { data: any }) => {
            const [, , , _path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);

            if (!this.memoryViewRef.current) {
                return;
            }

            const memory: IMemoryPath[] = this.memoryViewRef.current.state.memory;
            const path = memory.find(({ path }) => path === _path);

            if (!path || path.value === value) {
                return;
            }

            // Check value for undefined, if undefined return
            if (path.value && path.value.toString() === value) {
                return;
            }

            const idx = this.memoryViewRef.current.state.memory.indexOf(path);
            memory[idx] =  { ...path, value };
            this._memorySbj.next([ ...memory ]);
        });
    }

    render({
        shard,
        memory,
        segment
    }: {
        shard: string,
        memory: IMemoryPath[]
        segment: string
    }) {
        ReactDOM.render(
            <ResizablePanel>
                <MemoryView ref={ this.memoryViewRef }
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
                />
            </ResizablePanel>,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    onInput = (path: string) => {
        if (!this.memoryViewRef.current) {
            return;
        }

        const memory = [...this.memoryViewRef.current.state.memory, { path } as IMemoryPath];
        this._memorySbj.next(memory);

        putWatches(memory);
        this.initMemoryPipeSubscription();
    }

    onClose = () => {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }

        this._panel.destroy();
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

        if (!this.memoryViewRef.current) {
            return;
        }

        let value;
        if (response.data) {
            value = JSON.parse(pako.ungzip(atob(response.data.substring(3)), {to: 'string'}));
        }

        const memory = this.memoryViewRef.current.state.memory;
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
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, value, shard });
            this.hideProgress();
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }

        const memory = this.memoryViewRef.current.state.memory;
        const idx = memory.findIndex((item: any) => item.path === path);

        if (idx === -1) {
            return;
        }

        memory[idx] = { path, value };
        this._memorySbj.next([ ...memory ]);
    }

    @progress
    async onMemoryRemove(path: string, shard: string): Promise<void> {
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, shard });
            this.hideProgress()
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }
    }

    @progress
    async onMemoryDelete(path: string): Promise<void> {
        if (!this.memoryViewRef.current) {
            return;
        }

        const memory = this.memoryViewRef.current.state.memory;
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

        if (!this.memoryViewRef.current) {
            return;
        }

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            segmentData: response.data,
            _segmentData: response.data,
            segmentHasChange: false
        });
    }

    @progress
    async onSegmentUpdate(segment: string, data: string, shard: string): Promise<void> {
        try {
            await this._api.setUserMemorySegment({ segment, data, shard });
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            segmentData: data,
            _segmentData: data,
            segmentHasChange: false
        });
    }

    showProgress() {
        animationStartTime = new Date() .getTime();

        if (!this.memoryViewRef.current) {
            return;
        }

        this.memoryViewRef.current.state.isProgressing = true;
        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state
        });
    }

    hideProgress() {
        const now = new Date() .getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);

        setTimeout(() => {
            if (!this.memoryViewRef.current) {
                return;
            }

            this.memoryViewRef.current.state.isProgressing = false;
            this.memoryViewRef.current.setState({
                ...this.memoryViewRef.current.state
            });
        }, delay > 0 ? delay : 0);
    }

    // Atom pane required interface's methods
    getURI() {
        return 'atom://screeps-ide-memory-view';
    }
    
    getTitle() {
        return '';
    }
    
    isPermanentDockItem() {
        return true;
    }
    
    getAllowedLocations() {
        return ['top'];
    }
}