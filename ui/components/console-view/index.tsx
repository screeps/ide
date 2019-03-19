/// <reference path='./index.d.ts' />

import * as React from 'react';

import { default as ConsoleControlsView } from './components/controls';
import { default as ConsoleMessagesListView } from './components/messages-list';
import { default as ConsoleInputView } from './components/console-input';

class ConsoleView extends React.Component<IConsoleViewProps> {
    //@ts-ignore
    props: IConsoleViewProps;
    state: IConsoleViewState;

    constructor(props: IConsoleViewProps) {
        super(props);

        this.state = {
            shard: props.shard,
            shards: props.shards || [],
            paused: true,
            messages: props.messages || []
        };
    }

    public render() {
        return (
            <div className='screeps-ide screeps-console screeps-console__view'>
                <ConsoleControlsView
                    shard={ this.state.shard }
                    shards={ this.state.shards }
                    paused={ this.state.paused }

                    onShard={ this.onShard }
                    onResume={ this.onResume }
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

    onResume = () => {
        this.setState({
            ...this.state,
            paused: false
        });

        this.props.onResume && this.props.onResume();
    }

    onPause = () => {
        this.setState({
            ...this.state,
            paused: true
        });

        this.props.onPause && this.props.onPause();
    }

    onShard = (shard: string) => {
        this.setState({ ...this.state, shard });

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

    onInput = (expression: string) => {
        this.props.onInput && this.props.onInput(expression);
    }
}

export default ConsoleView;
