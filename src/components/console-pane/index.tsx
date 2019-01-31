import { Panel } from 'atom';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Observable } from 'rxjs';

import { ConsoleView } from '../../../ui';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { Service } from '../../service';
import { User } from '../../services/user';

let clientY: number;

export class ConsolePane {
    public element: HTMLElement;
    private _panel: Panel;

    public shard: any;
    public consolePipe$: Observable<any>;

    constructor(
        private _user: User,
        private _api: Api,
        private _socket: Socket,
        private _service: Service
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '300px';

        this.shard = this._user.shard;
        this.consolePipe$ = this._socket.on(`user:${ this._user.id }/console`);

        this.render({});

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }

    render({ }) {
        ReactDOM.render(
            <ConsoleView
                output={ this.consolePipe$ }
                shard={ this.shard }
                shards={ this._service.shards$ }

                onShard={ this.onShard }
                onInput={ this.onInput }
                onClose={ this.onClose }
                onResizeStart={ this.onResizeStart }
            />,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    private onInput = async ({ expression }: { expression: string }) => {
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

    private onShard = (shard: string) => {
        this.shard = shard;
    }

    private onClose = () => {
        this._panel.destroy();
    }

    private onResizeStart = (event: any) => {
        clientY = event.clientY;

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.onResizeStop);
    }

    private onResize = (event: any) => {
        const offsetY = event.clientY - clientY;
        clientY = event.clientY;

        //@ts-ignore
        const height = parseInt(this.element.style.height, 10);

        this.element.style.height = `${ height - offsetY }px`
    }

    private onResizeStop = () => {
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeStop);
    }


    // Atom pane required interface's methods
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