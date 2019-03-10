import { Panel } from 'atom';

const pako = require('pako');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subscription, merge } from 'rxjs';

import { MemoryView, ResizablePanel } from '../../../ui';
import { Service } from '../../service';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { getWatches, putWatches } from '../../utils';
import { User } from '../../services/user';

let animationStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

export class MemoryPane {
    public element: HTMLElement;
    private _panel: Panel;

    memoryViewRef = React.createRef<MemoryView>();

    watches: IMemoryPath[];
    pipe$: any;
    _pipe$: Subscription | null = null;

    shard: string;
    segment: string = '0';

    constructor(
        private _user: User,
        private _api: Api,
        private _socket: Socket,
        private _service: Service
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '300px';

        this.shard = this._user.shard;

        this.watches = getWatches();
        this.initMemoryPipeSubscription();

        this.render({});

        this.onSegment(this.segment);

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }

    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }

        const watches$: any = [];
        this.watches.forEach((item: any) => {
            const pipe = this._socket.on(`user:${ this._user.id }/memory/${ this.shard }/${ item.path }`);
            watches$.push(pipe);
        });
        this.pipe$ = merge(...watches$);

        this._pipe$ = this.pipe$.subscribe(({ data: [channel, value] }: { data: any }) => {
            const [, , , path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);

            if (!this.memoryViewRef.current) {
                return;
            }

            const watches = this.memoryViewRef.current.state.watches;
            const watch = watches.find((item: any) => item.path === path);

            if (!watch || watch.value === value) {
                return;
            }

            if (watch.value && watch.value.toString() === value) {
                return;
            }

            console.log(path, value);

            const idx = this.memoryViewRef.current.state.watches.indexOf(watch);
            watches[idx] =  Object.assign({}, { ...watch, value })

            this.memoryViewRef.current.setState({
                ...this.memoryViewRef.current.state,
                watches: [...watches]
            });
        });
    }

    render({ }) {
        ReactDOM.render(
            <ResizablePanel>
                <MemoryView ref={ this.memoryViewRef }
                    pipe={ this.pipe$ }
                    
                    onInput={ this.onInput }

                    onClose={ this.onClose }

                    watches={ this.watches }
                    onMemory={ this.onMemory }
                    onMemoryRefresh={ this.onMemory }
                    onMemoryUpdate={ this.onMemoryUpdate }
                    onMemoryRemove={ this.onMemoryRemove }
                    onMemoryDelete={ this.onMemoryDelete }

                    shard={ this.shard }
                    shards={ this._service.shards$ }
                    onShard={ this.onShard }

                    segment={ this.segment }
                    onSegment={ this.onSegment }
                    onSegmentRefresh={ this.onSegment }
                    onSegmentUpdate={ this.onSegmentUpdate }
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

        const watches = [...this.memoryViewRef.current.state.watches, { path } as IMemoryPath];

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            watches
        });

        putWatches(watches);
        this.watches = watches;
        this.initMemoryPipeSubscription();
    }

    onClose = () => {
        this._panel.destroy();
    }

    onShard = (shard: string) => {
        this.shard = shard;

        this.onSegment(this.segment);
    }

    onMemory = async (path: string): Promise<void> => {
        this.showProgress();

        let response: IUserMemoryResponse;
        try {
            response = await this._api.getUserMemory({ path, shard: this.shard });
            this.hideProgress();
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

        const watches = this.memoryViewRef.current.state.watches;
        const watch = watches.find((item: any) => item.path === path);

        if (!watch) {
            return;
        }

        const idx = watches.indexOf(watch);
        watches[idx] = { ...watch, value };

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            watches: [...watches]
        });
    }

    onMemoryUpdate = async (path: string, value: any): Promise<void> => {
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, value, shard: this.shard });
            this.hideProgress();
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }

        const watches = this.memoryViewRef.current.state.watches;
        const watch = watches.find((item: any) => item.path === path);

        if (!watch) {
            return;
        }

        const idx = watches.indexOf(watch);
        watches[idx] =  { ...watch, value };

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            watches: [...watches]
        });
    }

    onMemoryRemove = async (path: string): Promise<void> => {
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, shard: this.shard });
            this.hideProgress()
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }
    }

    onMemoryDelete = (path: string) => {
        if (!this.memoryViewRef.current) {
            return;
        }

        const watches = this.memoryViewRef.current.state.watches;
        const watch = watches.find((item: any) => item.path === path);

        if (!watch) {
            return;
        }

        const idx = watches.indexOf(watch);
        watches.splice(idx, 1);

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            watches: [...watches]
        });

        putWatches(watches);
        this.watches = watches;
        this.initMemoryPipeSubscription();
    }

    onSegment = async (segment: string): Promise<void> => {
        this.showProgress();
        this.segment = segment;

        let response: IUserMemorySegmentResponse;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard: this.shard });
            this.hideProgress();
        } catch (err) {
            return;
        }

        if (!this.memoryViewRef.current) {
            return;
        }

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            segment,
            segmentData: response.data,
            _segmentData: response.data,
            segmentHasChange: false
        });
    }

    onSegmentUpdate = async (data: string): Promise<void> => {
        this.showProgress();
        try {
            await this._api.setUserMemorySegment({ data, segment: this.segment, shard: this.shard });
            this.hideProgress();
        } catch (err) {
            //Noop.
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

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            isProgressing: true
        });
    }

    hideProgress() {
        const now = new Date() .getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);

        setTimeout(() => {
            if (!this.memoryViewRef.current) {
                return;
            }

            this.memoryViewRef.current.setState({
                ...this.memoryViewRef.current.state,
                isProgressing: false
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