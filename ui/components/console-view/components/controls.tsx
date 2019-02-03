import * as React from 'react';

interface IConsoleControlsViewProps {
    shard: string;
    shards: any;
    paused: boolean;

    onShard?: Function;
    onStart?: Function;
    onPause?: Function;
    onClose?: Function;
    onDelete?: Function;
}

interface IConsoleControlsViewState {
    paused: boolean;
}

class ConsoleControlsView extends React.Component<IConsoleControlsViewProps> {
    //@ts-ignore
    props: IConsoleControlsViewProps;
    state: IConsoleControlsViewState;

    constructor(props: IConsoleControlsViewProps) {
        super(props);

        this.state = {
            paused: props.paused
        };
    }

    onShard = (event: any) => {
        this.props.onShard && this.props.onShard(event.target.value);
    }

    onStart = () => {
        this.setState({
            ...this.state,
            paused: true
        });
        this.props.onStart && this.props.onStart();
    }

    onPause = () => {
        this.setState({
            ...this.state,
            paused: false
        });
        this.props.onPause && this.props.onPause();
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onDelete = () => {
        this.props.onDelete && this.props.onDelete();
    }

    public render() {
        let toggle;

        if (!this.state.paused) {
            toggle = (<button className='btn icon' onClick={ this.onStart }><i className='sc-icon-play' /></button>);
        } else {
            toggle = (<button className='btn icon' onClick={ this.onPause }><i className='sc-icon-pause' /></button>);
        }

        return (
            <div className='screeps-console__controls'>
                <div className=''>
                    <select className='btn' onChange={ this.onShard } value={ this.props.shard }>
                        { this.props.shards.map(({ name }: { name: string }) => {
                            return (<option key={ name } value={ name }>{ name }</option>);
                        })}
                    </select>
                </div>
                <div className='btn-group'>
                    <button className='btn icon' onClick={ this.onDelete }><i className='sc-icon-delete' /></button>
                    { toggle }
                    <button className='btn icon' onClick={ this.onClose }><i className='sc-icon-clear' /></button>
                </div>
            </div>
        );
    }
}

export default ConsoleControlsView;
