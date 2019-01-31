/// <reference path='./index.d.ts' />

import * as React from 'react';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { default as ConsoleControlsView } from './components/controls';
import { default as ConsoleMessagesListView } from './components/messages-list';
import { default as ConsoleInputView } from './components/console-input';

class ConsoleView extends React.Component<IConsoleViewProps> {
    //@ts-ignore
    props: IConsoleViewProps;

    state: IConsoleViewState;

    _output$: Subscription | null = null;
    _shards$: Subscription | null = null;

    constructor(props: IConsoleViewProps) {
        super(props);

        this.state = {
            shard: props.shard,
            shards: [],
            paused: true,
            messages: []
        };
    }

    componentDidMount() {
        this._subscribe();

        this.setState({
            ...this.state,
            shard: this.props.shard
        });

        this._shards$ = this.props.shards.subscribe((shards: any) => {
            this.setState({
                ...this.state,
                shards
            });
        });
    }

    _subscribe() {
        this._output$ = this.props.output
            .pipe(filter((msg: any) => {
                if (msg.data && msg.data[1].messages && msg.data[1].messages.log.length) {
                    return true;
                }

                if (msg.data && msg.data[1].error) {
                    return true;
                }

                return false;
            }))
            .subscribe((msg: any) => {
                this.pushMessage(msg);
            });

        this.setState({
            ...this.state,
            paused: false
        });
    }

    _unsubscribe() {
        if (!this._output$) {
            return;
        }

        this._output$.unsubscribe();
        this._output$ = null

        this.setState({
            ...this.state,
            paused: true
        });
    }

    pushMessage(msg: any) {
        this.setState({
            ...this.state,
            messages: [...this.state.messages, msg]
        });
    }

    onStart = () => {
        this._subscribe();
    }

    onPause = () => {
        this._unsubscribe();
    }

    onShard = (shard: string) => {
        this.props.onShard && this.props.onShard(shard);
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onDelete = () => {
        this.setState({
            ...this.state,
            messages: []
        });
    }

    onInput = ({ expression }: { expression: string}) => {
        this.pushMessage({
            data: [null, {
                messages: {
                    log: [ expression ]
                }
            }]
        });

        this.props.onInput && this.props.onInput({ expression });
    }

    onResizeStart = (event: any) => {
        this.props.onResizeStart && this.props.onResizeStart(event);
    }

    public render() {
        return (
            <div className='screeps-ide screeps-console screeps-console__view'>
                <div className='panel-divider' onMouseDown={ this.onResizeStart }/>
                <ConsoleControlsView
                    shard={ this.state.shard }
                    shards={ this.state.shards }
                    paused={ this.state.paused }

                    onShard={ this.onShard }
                    onStart={ this.onStart }
                    onPause={ this.onPause }
                    onClose={ this.onClose }
                    onDelete={ this.onDelete }
                />
                <hr className='screeps-hr' />
                <ConsoleMessagesListView messages={ this.state.messages || [] }/>
                <hr className='screeps-hr' />
                <ConsoleInputView onInput={ this.onInput }/>
            </div>
        );
    }
}

export default ConsoleView;
