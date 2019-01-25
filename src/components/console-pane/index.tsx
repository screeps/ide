import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ConsoleView } from '../../../ui';
import { Api } from '../../api';
import { Socket } from '../../socket';

import { Observable } from 'rxjs';
import { Panel } from 'atom';

import { Service } from '../../service';

let clientY: number;
const userId = '5a58af97d870324d18b43f02';

export class ConsolePane {
    public element: HTMLElement;
    private _panel: Panel;

    public shard: any;
    public consolePipe$: Observable<any>;

    constructor(
        private _api: Api,
        private _socket: Socket,
        private _service: Service
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '300px';

        this.consolePipe$ = this._socket.on(`user:${ userId }/console`);

        this.render({});

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }

    onInput = async ({ expression }: { expression: string }) => {
        try {
            const data = await this._api.sendUserConsole({
                expression,
                shard: this.shard
            });

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    onShard = (shard: string) => {
        console.log(123, shard);
        this.shard = shard;
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
            <ConsoleView
                output={ this.consolePipe$ }
                shards={ this._service.shards$ }

                onShard={ this.onShard }
                onInput={ this.onInput }
                onClose={ this.onClose }
                onResizeStart={ this.onResizeStart }
            />,
            this.element as HTMLElement
        )
    }

    getURI() {
        return 'atom://screeps-ide-console-view';
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