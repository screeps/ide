import * as React from 'react';

interface IMemoryControlsViewProps {
    shards: any;

    onClose?: Function;
    onToggleView?: Function;
}

export default class MemoryControlsView extends React.Component<IMemoryControlsViewProps> {
    //@ts-ignore
    props: IMemoryControlsViewProps;

    constructor(props: IMemoryControlsViewProps) {
        super(props);
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onMainMemory = () => {
        this.props.onToggleView && this.props.onToggleView({ view: 'main' });
    }

    onSegments = () => {
        this.props.onToggleView && this.props.onToggleView({ view: 'segments' });
    }

    public render() {
        return (
            <div className='screeps-memory__controls'>
                <div className=''>
                    <select className='btn'>
                        { this.props.shards.map(({ name }: { name: string }) => {
                            return (<option key={ name } value={ name }>{ name }</option>);
                        })}
                    </select>
                </div>
                <div className='btn-group'>
                    <button className='btn icon' onClick={ this.onMainMemory }>
                        <i className='sc-icon-dehaze' />
                    </button>
                    <button className='btn icon' onClick={ this.onSegments }>
                        <i className='sc-icon-view' />
                    </button>
                    <button className='btn icon' onClick={ this.onClose }>
                        <i className='sc-icon-clear' />
                    </button>
                </div>
            </div>
        );
    }
}
