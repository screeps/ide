import * as React from 'react';

// import { default as MemorySegmentVeiw } from '../components/segment';

interface IMemoryControlsViewProps {
    view: string;
    shard: string;
    shards: any;

    onShard?: Function;
    onClose?: Function;
    onToggleView?: Function;

    children?: any;
}

export const MEMORY_MAIN_VIEW = 'MEMORY_MAIN_VIEW';
export const MEMORY_SEGMENTS_VIEW = 'MEMORY_SEGMENTS_VIEW';

export default function(props: IMemoryControlsViewProps) {
    return (
        <div className='screeps-memory__controls'>
            <div className=''>
                <select className='input-select' onChange={ onShard } value={ props.shard }>
                    { props.shards.map(({ name }: { name: string }) => {
                        return (<option key={ name } value={ name }>{ name }</option>);
                    })}
                </select>
                { props.children }
            </div>
            <div className='btn-group'>
                <button id='screeps-memory__control-main'
                    className={ ['btn icon', props.view === MEMORY_MAIN_VIEW ? 'selected' : '' ].join(' ') } onClick={ onMainMemory }>
                    <i className='sc-icon-dehaze' />
                </button>
                <button id='screeps-memory__control-segments'
                    className={ ['btn icon', props.view === MEMORY_SEGMENTS_VIEW ? 'selected' : '' ].join(' ') } onClick={ onSegments }>
                    <i className='sc-icon-view' />
                </button>
            </div>
        </div>
    );

    function onShard(event: any) {
        props.onShard && props.onShard(event.target.value);
    }

    function onMainMemory() {
        props.onToggleView && props.onToggleView(MEMORY_MAIN_VIEW);
    }

    function onSegments() {
        props.onToggleView && props.onToggleView(MEMORY_SEGMENTS_VIEW);
    }
}
