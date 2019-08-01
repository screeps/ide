import * as React from 'react';
// import { useState } from 'react';

export interface IMemorySegmentControlsViewProps {
    segment: string;
    hasChange: boolean;

    onSegment: Function;
    onUpdate: Function;
}

export const BTN_SAVE = 'screeps-memory__segment-controls-save';
export const BTN_RELOAD = 'screeps-memory__segment-controls-reload';

const segments: number[] = [];
for (let i = 0; i < 100; i++) {
    segments.push(i);
}

export default function(props: IMemorySegmentControlsViewProps) {
    return (
        <div className='screeps-memory__segment-controls'>
            Segment #:
            <select className='input-select' onChange={ onSegment } value={ props.segment }>
                { segments.map((name) => {
                    return (<option key={ name } value={ name }>{ name }</option>);
                })}
            </select>
            <button id={ `${ BTN_RELOAD }` }
                type='button' className='btn' onClick={ onRefresh }>
                <i className='sc-icon-cached' />
            </button>
            <button id={ `${ BTN_SAVE }` }
                type='button' className='btn' onClick={ onUpdate } disabled={ !props.hasChange }>
                <i className='sc-icon-done' />
            </button>
        </div>
    );

    function onSegment(event: any) {
        props.onSegment && props.onSegment(event.target.value);
    }

    function onRefresh() {
        props.onSegment && props.onSegment(props.segment);
    }

    function onUpdate(event: any) {
        props.onUpdate && props.onUpdate(event.target.value);
    }
}
