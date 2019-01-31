import { Panel } from 'atom';

const pako = require('pako');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { merge } from 'rxjs';

import { MemoryView } from '../../../ui';
import { Service } from '../../service';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { getWatches } from '../../utils';
import { User } from '../../services/user';

let clientY: number;

export class MemoryPane {
    public element: HTMLElement;
    private _panel: Panel;

    memoryViewRef = React.createRef<MemoryView>();

    watches: any;
    pipe$: any;

    shard: string;

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
        const watches$: any = [];
        this.watches.forEach((item: any) => {
            const pipe = this._socket.on(`user:${ this._user.id }/memory/${ this.shard }/${ item.path }`);
            watches$.push(pipe);
        })
        this.pipe$ = merge(...watches$);

        this.render({});

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
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

    render({ }) {
        ReactDOM.render(
            <MemoryView ref={ this.memoryViewRef }
                pipe={ this.pipe$ }
                shard={ this.shard }
                shards={ this._service.shards$ }
                watches={ this.watches }

                onClick={ this.getUserMemory }
                onClose={ this.onClose }
                onResizeStart={ this.onResizeStart }
            />,
            this.element as HTMLElement
        )
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