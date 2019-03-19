import { Panel, CompositeDisposable } from 'atom';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject, Observable, Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { ConsoleView, ResizablePanel } from '../../../ui';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { Service } from '../../service';
import { User } from '../../services/user';

export const ACTION_CLOSE = 'ACTION_CLOSE';

export class ConsolePanel {
    public element: HTMLElement;
    private _panel: Panel;

    public viewRef = React.createRef<ConsoleView>();

    private _eventsSbj = new Subject();
    public events$: Observable<any> = this._eventsSbj.asObservable();

    private _console$: Subscription | null = null;
    private _tooltipsDisposables: CompositeDisposable | null = null;

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

        this.render({
            shard: this._user.shard
        });

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });

        this._panel.onDidDestroy(() => {
            this._eventsSbj.next({ type: ACTION_CLOSE });
        });

        this._service.shards$
            .pipe(tap((shards: any) => {
                if (!this.viewRef.current) {
                    return;
                }

                this.viewRef.current.setState({
                    ...this.viewRef.current.state,
                    shards
                });
            }))
            .subscribe();

        this.onResume();
    }

    render({ shard }: { shard: string }) {
        ReactDOM.render(
            <ResizablePanel>
                <ConsoleView ref={ this.viewRef }
                    shard={ shard }

                    onShard={() => this.onShard()}
                    onInput={(expression: string) => this.onInput(expression)}
                    onClose={() => this.onClose()}
                    onPause={() => this.onPause()}
                    onResume={() => this.onResume()}
                />
            </ResizablePanel>,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    private async onInput(expression: string): Promise<void> {
        if (!this.viewRef.current) {
            return;
        }

        const msg = {
            log: expression
        };

        if (!this.viewRef.current) {
            return;
        }

        this.viewRef.current.setState({
            ...this.viewRef.current.state,
            messages: [...this.viewRef.current.state.messages, msg]
        });

        try {
            await this._api.sendUserConsole({
                expression,
                shard: this.viewRef.current.state.shard
            });
        } catch (err) {
            // Noop.
        }
    }

    private async onShard(): Promise<void> {
    }

    private async onClose(): Promise<void> {
        if (this._console$) {
            this._console$.unsubscribe();
            this._console$ = null;
        }

        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }

        this._panel.destroy();
    }

    private async onPause(): Promise<void> {
        if (this._console$) {
            this._console$.unsubscribe();
            this._console$ = null;
        }

        this._applyTooltips();
    }

    private async onResume(): Promise<void> {
        this.onPause();

        this._console$ = this._socket.on(`user:${ this._user.id }/console`)
            .pipe(filter((msg: any) => {
                if (msg.data && msg.data[1].messages && msg.data[1].messages.log.length) {
                    return true;
                }

                if (msg.data && msg.data[1].error) {
                    return true;
                }

                return false;
            }))
            .pipe(tap((msg: any) => {
                if (!this.viewRef.current) {
                    return;
                }

                const timeStamp = msg.timeStamp;
                const shard = msg.data[1].shard;

                const messages: any = [];
                try {
                    msg.data[1].messages.log.reduce((messages: any[], log: string) => {
                        messages.push({
                            log,
                            timeStamp,
                            shard
                        });
                        return messages
                    }, messages)
                } catch (err) {
                    // Noop.
                }

                if (msg.data[1].error) {
                    messages.push({
                        error: msg.data[1].error,
                        timeStamp,
                        shard
                    })
                }

                this.viewRef.current.setState({
                    ...this.viewRef.current.state,
                    messages: [...this.viewRef.current.state.messages, ...messages]
                });
            }))
            .subscribe();

        this._applyTooltips();
    }

    public show() {
        this._panel.show();
    }

    public hide() {
        this._panel.hide();
    }

    private _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }

            this._tooltipsDisposables = new CompositeDisposable();

            const clearConsoleBtnRef = document.getElementById('screeps-console__delete');
            if (clearConsoleBtnRef) {
                const disposable = atom.tooltips.add(clearConsoleBtnRef, { title: 'Clear' });
                this._tooltipsDisposables.add(disposable);
            }

            const closeConsoleBtnRef = document.getElementById('screeps-console__close');
            if (closeConsoleBtnRef) {
                const disposable = atom.tooltips.add(closeConsoleBtnRef, { title: 'Close panel' });
                this._tooltipsDisposables.add(disposable);
            }

            const pauseConsoleBtnRef = document.getElementById('screeps-console__pause');
            if (pauseConsoleBtnRef) {
                const disposable = atom.tooltips.add(pauseConsoleBtnRef, { title: 'Pause tracking' });
                this._tooltipsDisposables.add(disposable);
            }

            const playConsoleBtnRef = document.getElementById('screeps-console__play');
            if (playConsoleBtnRef) {
                const disposable = atom.tooltips.add(playConsoleBtnRef, { title: 'Resume tracking' });
                this._tooltipsDisposables.add(disposable);
            }
        });
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