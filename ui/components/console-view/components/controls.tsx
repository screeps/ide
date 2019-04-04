import * as React from 'react';

interface IConsoleControlsViewProps {
    shard: string;
    shards: any;
    paused: boolean;

    onShard?: Function;
    onResume?: Function;
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

    public render() {
        let toggle;

        if (!this.state.paused) {
            toggle = (<button id='screeps-console__play'
                className='btn icon' onClick={ this.onResume }><i className='sc-icon-play' />
            </button>);
        } else {
            toggle = (<button id='screeps-console__pause'
                className='btn icon' onClick={ this.onPause }><i className='sc-icon-pause' />
            </button>);
        }

        return (
            <div className='screeps-console__controls'>
                <div className=''>
                    <select className='input-select' onChange={ this.onShard } value={ this.props.shard }>
                        { this.props.shards.map(({ name }: { name: string }) => {
                            return (<option key={ name } value={ name }>{ name }</option>);
                        })}
                    </select>
                </div>
                <div className='btn-group'>
                    <button id='screeps-console__delete'
                        className='btn icon' onClick={ this.onDelete }><i className='sc-icon-delete' />
                    </button>
                    { toggle }
                    {/* <button id='screeps-console__close'
                        className='btn icon' onClick={ this.onClose }><i className='sc-icon-clear' />
                    </button> */}
                </div>
            </div>
        );
    }

    onShard = (event: any) => {
        this.props.onShard && this.props.onShard(event.target.value);
    }

    onPause = () => {
        this.state.paused = false;
        this.setState({ ...this.state });

        this.props.onPause && this.props.onPause();
    }

    onResume = () => {
        this.state.paused = true;
        this.setState({ ...this.state });

        this.props.onResume && this.props.onResume();
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onDelete = () => {
        this.props.onDelete && this.props.onDelete();
    }
}

export default ConsoleControlsView;
