import * as React from 'react';

// import { default as MemorySegmentVeiw } from '../components/segment';

interface IMemoryControlsViewProps {
    shard: string;
    shards: any;

    onShard?: Function;
    onClose?: Function;
    onToggleView?: Function;

    children?: any;
}

export const MEMORY_MAIN_VIEW = 'MEMORY_MAIN_VIEW';
export const MEMORY_SEGMENTS_VIEW = 'MEMORY_SEGMENTS_VIEW';

export default class MemoryControlsView extends React.Component<IMemoryControlsViewProps> {
    //@ts-ignore
    props: IMemoryControlsViewProps;

    constructor(props: IMemoryControlsViewProps) {
        super(props);
    }

    onShard = (event: any) => {
        this.props.onShard && this.props.onShard(event.target.value);
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onMainMemory = () => {
        this.props.onToggleView && this.props.onToggleView(MEMORY_MAIN_VIEW);
    }

    onSegments = () => {
        this.props.onToggleView && this.props.onToggleView(MEMORY_SEGMENTS_VIEW);
    }

    public render() {
        return (
            <div className='screeps-memory__controls'>
                <div className=''>
                    <select className='btn' onChange={ this.onShard } value={ this.props.shard }>
                        { this.props.shards.map(({ name }: { name: string }) => {
                            return (<option key={ name } value={ name }>{ name }</option>);
                        })}
                    </select>
                    { this.props.children }
                </div>
                <div className='btn-group'>
                    <button id='screeps-memory__control-main'
                        className='btn icon' onClick={ this.onMainMemory }>
                        <i className='sc-icon-dehaze' />
                    </button>
                    <button id='screeps-memory__control-segments'
                        className='btn icon' onClick={ this.onSegments }>
                        <i className='sc-icon-view' />
                    </button>
                    <button id='screeps-memory__control-close'
                        className='btn icon' onClick={ this.onClose }>
                        <i className='sc-icon-clear' />
                    </button>
                </div>
            </div>
        );
    }
}
