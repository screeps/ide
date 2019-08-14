// import { Panel, CompositeDisposable } from 'atom';
import { CompositeDisposable, ViewModel } from 'atom';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';

import { ConsoleView } from '../../../ui';
import { Api } from '../../api';
import { Socket } from '../../socket';
import { Service } from '../../service';
import { User } from '../../services/user';
import { getApi, getSocket, getUser, applyTooltip } from '../../utils';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const CONSOLE_URI = 'atom://screeps-ide/console';

export class ConsolePanel implements ViewModel {
    public element: HTMLElement;

    // @ts-ignore
    private _console$: Subject<void> | null;
    private _tooltipsDisposables: CompositeDisposable | null = null;

    private _state = {
        messages: []
    }

    public get state(): any {
        return this._state;
    }

    public set state(state: any) {
        this._state = {
            ...this._state,
            ...state
        }

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
        state: IConsoleViewState = {} as IConsoleViewState
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
            try {
                this._api = await getApi();
                this._user = await getUser();
                this._socket = getSocket();
                this._service = new Service()

                this.state = { shard: this._user.shard };

                this._service.shards$
                    .pipe(tap((shards: any) => this.state = { shards }))
                    .subscribe();

                this.onResume();
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

    render({ shard, shards, messages = [] }: IConsoleViewState) {
        ReactDOM.render(
            // @ts-ignore
            <ConsoleView ref={ this.viewRef }
                shard={ shard }
                shards={ shards }
                messages={ messages }

                onShard={(shard) => this.onShard(shard)}
                onInput={(expression: string) => this.onInput(expression)}
                onClose={() => this.onClose()}
                onPause={() => this.onPause()}
                onResume={() => this.onResume()}
                onClean={() => this.onClean()}
            />,
            this.element as HTMLElement
        )
    }

    // Private component actions.
    private async onInput(expression: string): Promise<void> {
        const messages = [...this.state.messages, { expression }];
        this.state  = { messages };

        try {
            await this._api.sendUserConsole({
                expression,
                shard: this.state.shard
            });
        } catch (err) {
            // Noop.
        }
    }

    private async onShard(shard: any): Promise<void> {
        this.state = { shard };
    }

    private async onClose(): Promise<void> {
        this.destroy();
    }

    private async onPause(): Promise<void> {
        if (this._console$) {
            this._console$.next();
            this._console$.complete();
            this._console$ = null;
        }

        this._applyTooltips();
    }

    private async onResume(): Promise<void> {
        this.onPause();

        this._console$ = new Subject();

        this._socket.on(`user:${ this._user.id }/console`)
            .pipe(takeUntil(this._console$))
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

                try {
                    msg.data[1].messages.results.reduce((messages: any[], result: string) => {
                        messages.push({
                            result
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

                this.state = {
                    messages: [...this.state.messages, ...messages].slice(-100)
                };

            }))
            .subscribe(undefined, undefined, () => {
                this._socket.off(`user:${ this._user.id }/console`)
            });

        this._applyTooltips();
    }

    private async onClean(): Promise<void> {
        this.state = {
            messages: []
        };
    }

    private _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }

            let d;
            const subscriptions = this._tooltipsDisposables = new CompositeDisposable();

            d = applyTooltip('#screeps-console__delete', 'Clear', this.element);
            d && subscriptions.add(d);
            d = applyTooltip('#screeps-console__close', 'Close panel', this.element);
            d && subscriptions.add(d);
            d = applyTooltip('#screeps-console__pause', 'Pause tracking', this.element);
            d && subscriptions.add(d);
            d = applyTooltip('#screeps-console__play', 'Resume tracking', this.element);
            d && subscriptions.add(d);
        });
    }

    destroy() {
        if (this._console$) {
            this._console$.next();
            this._console$.complete();
            this._console$ = null;
        }

        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }
    }

    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ConsolePanel',
            state: this.state
        }
    }

    static deserialize({ state }: { state: any }) {
        return new ConsolePanel(state);
    }

    // Atom pane required interface's methods
    getURI() {
        return CONSOLE_URI;
    }

    getTitle() {
        return 'Console';
    }

    getAllowedLocations() {
        return ['bottom', 'top'];
    }
}
