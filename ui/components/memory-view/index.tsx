/// <reference path='./index.d.ts' />

import * as React from 'react';

import {
    MEMORY_MAIN_VIEW,
    MEMORY_SEGMENTS_VIEW,
    default as MemoryControlsView
} from './components/controls';
import { default as MemoryMainView } from './components/main';
import { default as MemorySegmentView } from './components/segment';
import { default as MemorySegmentControlsView } from './components/segment-controls';

export default class MemoryView extends React.Component<IMemoryViewProps> {
    //@ts-ignore
    props: IMemoryViewProps;

    state: IMemoryViewState;

    constructor(props: IMemoryViewProps) {
        super(props);

        this.state = {
            isProgressing: false,
            shard: props.shard,
            shards: props.shards || [],
            view: MEMORY_MAIN_VIEW,
            segment: props.segment,
            segmentData: '',
            _segmentData: '',
            segmentHasChange: false,
            memory: props.memory || []
        };
    }

    public render() {
        let view, segmentControls;

        if (this.state.view === MEMORY_MAIN_VIEW) {
            view = (<MemoryMainView
                memory={ this.state.memory }

                onInput={ this.onInput }

                onClick={ this.onMemory }
                onSave={ this.onMemoryUpdate }
                onReload={ this.onMemoryRefresh }
                onDelete={ this.onMemoryDelete }
                onRemovePath={ this.onMemoryRemove }
                onCancel={ this.onMemoryCancel }

            />);
        }

        if (this.state.view === MEMORY_SEGMENTS_VIEW) {
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

    onInput = (path: string) => {
        this.props.onInput && this.props.onInput(path);
    }

    onShard = (shard: string) => {
        this.state.shard = shard;
        this.setState({ ...this.state, shard });

        this.props.onShard && this.props.onShard(shard);

        if (this.state.view === MEMORY_SEGMENTS_VIEW) {
            this.onSegment(this.state.segment);
        }
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onToggleView = (view: string) => {
        this.state.view = view;
        this.setState({ ...this.state, view });

        if (view === MEMORY_SEGMENTS_VIEW) {
            this.onSegment(this.state.segment);
        }
    }

    onMemory = async (path: string): Promise<void> => {
        this.props.onMemory && await this.props.onMemory(path, this.state.shard);
    }

    onMemoryUpdate = (path: string, value: string) => {
        this.props.onMemoryUpdate && this.props.onMemoryUpdate(path, value, this.state.shard);
    }

    onMemoryRefresh = (path: string) => {
        this.props.onMemoryRefresh && this.props.onMemoryRefresh(path, this.state.shard);
    }

    onMemoryRemove = (path: string) => {
        this.props.onMemoryRemove && this.props.onMemoryRemove(path, this.state.shard);
    }

    onMemoryDelete = (path: string) => {
        this.props.onMemoryDelete && this.props.onMemoryDelete(path);
    }

    onMemoryCancel = (path: string) => {
        this.props.onMemoryCancel && this.props.onMemoryCancel(path);
    }

    onSegment = (segment: string) => {
        this.props.onSegment && this.props.onSegment(segment, this.state.shard);

        this.setState({ ...this.state, segment });
    }

    onSegmentChange = (data: string) => {
        this.setState({
            ...this.state,
            segmentData: data,
            segmentHasChange: this.state._segmentData !== data
        });
    }

    onSegmentRefresh = () => {
        const { segment, shard } = this.state;

        this.props.onSegmentRefresh && this.props.onSegmentRefresh(segment, shard);
    }

    onSegmentUpdate = () => {
        const { segment, segmentData, shard } = this.state;

        this.props.onSegmentUpdate && this.props.onSegmentUpdate(segment, segmentData, shard);
    }
}
