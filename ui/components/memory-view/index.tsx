/// <reference path='./index.d.ts' />

import * as React from 'react';
import { Subscription } from 'rxjs';

import { default as MemoryControlsView } from './components/controls';
import { default as MemoryMainView } from './components/main';
import { default as MemorySegmentView } from './components/segment';
import { default as MemorySegmentControlsView } from './components/segment-controls';

export default class MemoryView extends React.Component<IMemoryViewProps> {
    //@ts-ignore
    props: IMemoryViewProps;

    state: IMemoryViewState;

    _shards$: Subscription | null = null;
    _pipe$: Subscription | null = null;

    constructor(props: IMemoryViewProps) {
        super(props);

        this.state = {
            isProgressing: false,
            shard: props.shard,
            shards: [],
            view: 'main',
            segment: props.segment,
            segmentData: '',
            _segmentData: '',
            segmentHasChange: false,
            watches: props.watches
        };
    }

    componentDidMount() {
        if (this.props.shards) {
            this.initShardsPipeSubscription();
        }
    }

    public render() {
        let view, segmentControls;

        if (this.state.view === 'main') {
            view = (<MemoryMainView
                watches={ this.state.watches }

                onDelete={ this.onDelete }
                onInput={ this.onInput }
                onClick={ this.onMemory }
                onSave={ this.onMemoryUpdate }
                onReload={ this.onMemoryRefresh }
            />);
        }

        if (this.state.view === 'segments') {
            view = (<MemorySegmentView 
                segment={ this.state.segmentData }

                onChange={ this.onSegmentChange }
            />);
            segmentControls = (<MemorySegmentControlsView
                segment={ this.state.segment }
                hasChange={ this.state.segmentHasChange }

                onSegment={ this.onSegment }
                onRefresh={ this.onSegmentRefresh }
                onUpdate={ this.onSegmentUpdate }
            />);
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
                >
                    { segmentControls }
                </MemoryControlsView>
                <hr className={ 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') } />
                { view }
            </div>
        );
    }

    initShardsPipeSubscription() {
        this._shards$ = this.props.shards.subscribe((shards: any) => {
            this.setState({
                ...this.state,
                shards
            });
        });
    }

    onDelete = (path: string) => {
        this.props.onDelete && this.props.onDelete(path);
    }

    onInput = (data: any) => {
        this.props.onInput && this.props.onInput(data);
    }

    onShard = (shard: string) => {
        this.setState({ ...this.state, shard });

        this.props.onShard && this.props.onShard(shard);
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onResizeStart = (event: any) => {
        this.props.onResizeStart && this.props.onResizeStart(event);
    }

    onToggleView = ({ view }: { view: string }) => {
        this.setState({ ...this.state, view });
    }

    onMemory = async (path: string): Promise<void> => {
        this.props.onMemory && await this.props.onMemory(path);
    }

    onMemoryUpdate = (path: string, value: string) => {
        this.props.onMemoryUpdate && this.props.onMemoryUpdate(path, value);
    }

    onMemoryRefresh = (path: string) => {
        this.props.onMemoryRefresh && this.props.onMemoryRefresh(path);
    }

    onSegment = (segment: string) => {
        this.setState({ ...this.state, segment });

        this.props.onSegment && this.props.onSegment(segment);
    }

    onSegmentChange = (data: string) => {
        this.setState({
            ...this.state,
            segmentData: data,
            segmentHasChange: this.state._segmentData !== data
        });
    }

    onSegmentRefresh = () => {
        this.props.onSegmentRefresh && this.props.onSegmentRefresh(this.state.segment);
    }

    onSegmentUpdate = () => {
        this.props.onSegmentUpdate && this.props.onSegmentUpdate(this.state.segmentData);
    }
}
