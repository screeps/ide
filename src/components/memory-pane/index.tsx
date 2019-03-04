import { Panel } from 'atom';

const pako = require('pako');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subscription, merge } from 'rxjs';

import { MemoryView } from '../../../ui';
import { Service } from '../../service';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { getWatches, putWatches } from '../../utils';
import { User } from '../../services/user';

let clientY: number;

export class MemoryPane {
    public element: HTMLElement;
    private _panel: Panel;

    memoryViewRef = React.createRef<MemoryView>();

    watches: any;
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
            <MemoryView ref={ this.memoryViewRef }
                pipe={ this.pipe$ }
                shard={ this.shard }
                shards={ this._service.shards$ }
                watches={ this.watches }

                onInput={ this.onInput }
                onDelete={ this.onDelete }
                onClick={ this.getUserMemory }
                onClose={ this.onClose }
                onResizeStart={ this.onResizeStart }

                onShard={ this.onShard }

                segment={ this.segment }
                onSegment={ this.onSegment }
                onSegmentRefresh={ this.onSegment }
                onSegmentUpdate={ this.onSegmentUpdate }
            />,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    onInput = ({ expression: path }: { expression: string }) => {
        if (!this.memoryViewRef.current) {
            return;
        }

        const watches = [...this.memoryViewRef.current.state.watches, { path }];

        this.memoryViewRef.current.setState({
            ...this.memoryViewRef.current.state,
            watches
        });

        putWatches(watches);
        this.watches = watches;
        this.initMemoryPipeSubscription();
    }

    onDelete = (path: string) => {
        if (!this.memoryViewRef.current) {
            return;
        }

        const watches = this.memoryViewRef.current.state.watches;
        const watch = watches.find((item: any) => item.path === path);
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

    onClose = () => {
        this._panel.destroy();
    }

    onResizeStart = (event: any) => {
        clientY = event.clientY;

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.onResizeStop);
    }

    onResize = (event: any) => {
        const offsetY = event.clientY - clientY;
        clientY = event.clientY;

        //@ts-ignore
        const height = parseInt(this.element.style.height, 10);

        this.element.style.height = `${ height - offsetY }px`
    }

    onResizeStop = () => {
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeStop);
    }

    onShard = (shard: string) => {
        this.shard = shard;

        this.onSegment(this.segment);
    }

    onSegment = (segment: string) => {
        this.segment = segment;

        this._api.getUserMemorySegment({ segment, shard: this.shard })
            .then(({ data }) => {
                if (!this.memoryViewRef.current) {
                    return;
                }

                this.memoryViewRef.current.setState({
                    ...this.memoryViewRef.current.state,
                    segmentData: data,
                    _segmentData: data,
                    segmentHasChange: false
                });
            })
    }

    onSegmentUpdate = (data: string) => {
        this._api.setUserMemorySegment({ data, segment: this.segment, shard: this.shard });
    }

    getUserMemory = ({ path }: { path: string }) => {
        this._api.getUserMemory({ path, shard: this.shard })
            .then(({ data }) => {
                const __ = JSON.parse(pako.ungzip(atob(data.substring(3)), {to: 'string'}));

                if (!this.memoryViewRef.current) {
                    return;
                }

                const watches = this.memoryViewRef.current.state.watches;
                const watch: any = watches.find((item: any) => item.path === path);
                const idx = watches.indexOf(watch);
                watches[idx] = Object.assign({}, { ...watch, data: __ });

                this.memoryViewRef.current.setState({
                    ...this.memoryViewRef.current.state,
                    watches: [...watches]
                });
            });
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