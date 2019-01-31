/// <reference path='./index.d.ts' />

import * as React from 'react';
import { Subscription } from 'rxjs';

import { default as MemoryControlsView } from './components/controls';
import { default as MemoryMainView } from './components/main';
import { default as MemorySegmentsView } from './components/segments';
import { default as MemoryInputView } from './components/input';

export default class MemoryView extends React.Component<IMemoryViewProps> {
    //@ts-ignore
    props: IMemoryViewProps;

    state: IMemoryViewState;

    _shards$: Subscription | null = null;
    _pipe$: Subscription | null = null;

    constructor(props: IMemoryViewProps) {
        super(props);

        this.state = {
            shard: props.shard,
            shards: [],
            view: 'main',
            //@ts-ignore
            watches: this.props.watches
        };
    }

    componentDidMount() {
        if (this.props.pipe) {
            this.initMemoryPipeSubscription();
        }

        if (this.props.shards) {
            this.initShardsPipeSubscription();
        }
    }

    public render() {
        let view;

        if (this.state.view === 'main') {
            view = (<MemoryMainView watches={ this.state.watches } onClick={ this.onClick }/>);
        }

        if (this.state.view === 'segments') {
            view = (<MemorySegmentsView />);
        }

        return (
            <div className='screeps-ide screeps-memory screeps-memory__view'>
                <div className='panel-divider' onMouseDown={ this.onResizeStart } />
                <MemoryControlsView
                    shard={ this.state.shard }
                    shards={ this.state.shards }

                    onShard={ this.onShard }
                    onClose={ this.onClose }
                    onToggleView={ this.onToggleView }
                />
                <hr className='screeps-hr' />
                { view }
                <hr className='screeps-hr' />
                <MemoryInputView onInput={ this.onInput }/>
            </div>
        );
    }

    initMemoryPipeSubscription() {
        this._pipe$ = this.props.pipe.subscribe(({ data: [channel, value] }: { data: any }) => {
            //user:5a58af97d870324d18b43f02/memory/shard3/rooms
            const [, , , path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);

            const watches = this.state.watches;
            const watch = watches.find((item: any) => item.path === path);
            const idx = this.state.watches.indexOf(watch);
            watches[idx] =  Object.assign({}, { ...watch, value })

            this.setState({
                ...this.state,
                watches: [...watches]
            });
        });
    }

    initShardsPipeSubscription() {
        this._shards$ = this.props.shards.subscribe((shards: any) => {
            this.setState({
                ...this.state,
                shards
            });
        });
    }

    onClick = (item: any) => {
        this.props.onClick && this.props.onClick(item);
    }

    onInput = (data: any) => {
        console.log('input', data);
    }

    onShard = (shard: string) => {
        this.props.onShard && this.props.onShard(shard);
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onResizeStart = (event: any) => {
        this.props.onResizeStart && this.props.onResizeStart(event);
    }

    onToggleView = ({ view }: { view: string }) => {
        this.setState({
            ...this.state,
            view
        });
    }
}
