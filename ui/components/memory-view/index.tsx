/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, useEffect } from 'react';

import {
    MEMORY_MAIN_VIEW,
    MEMORY_SEGMENTS_VIEW,
    default as MemoryControlsView
} from './components/controls';
import { default as MemoryMainView } from './components/main';
import { default as MemorySegmentView } from './components/segment';
import { default as MemorySegmentControlsView } from './components/segment-controls';

export default function(props: IMemoryViewProps) {
    let memoryView, memoryControls;

    const [segmentData, setSegmentData] = useState<string>(props.segmentData || '');
    const [segmentHasChange, setSegmentHasChange] = useState<boolean>(false);

    useEffect(() => {
        onSegmentChange(props.segmentData);
    }, [props.segmentData]);

    if (props.view === MEMORY_MAIN_VIEW) {
        memoryView = (<MemoryMainView
            memory={ props.memory || [] }

            onInput={ onInput }

            onClick={ onMemory }
            onSave={ onMemoryUpdate }
            onReload={ onMemoryRefresh }
            onDelete={ onMemoryDelete }
            onRemovePath={ onMemoryRemove }
            onCancel={ onMemoryCancel }
        />);
    }

    if (props.view === MEMORY_SEGMENTS_VIEW) {
        memoryView = (<MemorySegmentView 
            segment={ segmentData }

            onChange={ onSegmentChange }
        />);
        memoryControls = (<MemorySegmentControlsView
            segment={ props.segment }
            hasChange={ segmentHasChange }

            onSegment={ onSegment }
            onUpdate={ onSegmentUpdate }
        />);
    }

    return (
        <div className='screeps-ide screeps-memory screeps-memory__view'>
            <MemoryControlsView
                shard={ props.shard }
                shards={ props.shards || [] }

                onShard={ onShard }
                onClose={ onClose }
                onToggleView={ onToggleView }
            >
                { memoryControls }
            </MemoryControlsView>
            <hr className={ 'screeps-hr' + (props.isProgressing ? ' screeps-hr--inprogress' : '') } />
            { memoryView }
        </div>
    );

    function onInput(path: string) {
        props.onInput && props.onInput(path);
    }

    function onShard(shard: string) {
        props.onShard && props.onShard(shard);
    }

    function onClose() {
        props.onClose && props.onClose();
    }

    function onToggleView(view: string) {
        props.onChangeView && props.onChangeView(view);
    }

    async function onMemory (path: string): Promise<void> {
        props.onMemory && await props.onMemory(path, props.shard);
    }

    function onMemoryUpdate(path: string, value: string) {
        props.onMemoryUpdate && props.onMemoryUpdate(path, value, props.shard);
    }

    function onMemoryRefresh(path: string) {
        props.onMemoryRefresh && props.onMemoryRefresh(path, props.shard);
    }

    function onMemoryRemove(path: string) {
        props.onMemoryRemove && props.onMemoryRemove(path, props.shard);
    }

    function onMemoryDelete(path: string) {
        props.onMemoryDelete && props.onMemoryDelete(path);
    }

    function onMemoryCancel(path: string) {
        props.onMemoryCancel && props.onMemoryCancel(path);
    }

    function onSegment(segment: string) {
        props.onSegment && props.onSegment(segment, props.shard);
    }

    function onSegmentChange(data: string) {
        setSegmentData(data);
        setSegmentHasChange(props.segmentData ? data !== props.segmentData : data !== '' );
    }

    function onSegmentUpdate() {
        props.onSegmentUpdate && props.onSegmentUpdate(props.segment, segmentData, props.shard);
    }
}
