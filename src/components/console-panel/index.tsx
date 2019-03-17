import { Panel } from 'atom';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Observable } from 'rxjs';

import { ConsoleView, ResizablePanel } from '../../../ui';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { Service } from '../../service';
import { User } from '../../services/user';

export const ACTION_CLOSE = 'ACTION_CLOSE';

export class ConsolePanel {
    public element: HTMLElement;
    private _panel: Panel;

    public shard: any;
    public consolePipe$: Observable<any>;

    private _eventsSbj = new Subject();
    public events$: Observable<any> = this._eventsSbj.asObservable();

    get isVisible() {
        if (!this._panel) {
            return false;
        }

        return this._panel.isVisible();
    }

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

        this._panel.onDidDestroy(() => {
            this._eventsSbj.next({ type: ACTION_CLOSE });
        });
    }

    render({ }) {
        ReactDOM.render(
            <ResizablePanel>
                <ConsoleView
                    output={ this.consolePipe$ }
                    shard={ this.shard }
                    shards={ this._service.shards$ }

                    onShard={ this.onShard }
                    onInput={ this.onInput }
                    onClose={ this.onClose }
                />
            </ResizablePanel>,
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

    public show() {
        this._panel.show();
    }

    public hide() {
        this._panel.hide();
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