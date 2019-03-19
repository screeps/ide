import * as React from 'react';

interface IConsoleMessageItemViewProps {
    message: any
}

class ConsoleMessageItemView extends React.Component<IConsoleMessageItemViewProps> {
    constructor(props: IConsoleMessageItemViewProps) {
        super(props);
    }

    public render() {
        let timestamp, shard, message, error;

        if (this.props.message.timeStamp) {
            timestamp = (
                <span>
                    <span className='brackets'>
                        { new Date(this.props.message.timeStamp) .toLocaleTimeString() }
                    </span>
                    &nbsp;
                </span>
            );
        }

        if (this.props.message.data[1].shard) {
            shard = (
                <span>
                    <span className='brackets'>
                        { this.props.message.data[1].shard }
                    </span>
                    &nbsp;
                </span>
            );
        }

        try {
            message = (
                <span className={timestamp ? '' : '--input'}>{ this.props.message.data[1].messages.log[0] }</span>
            );
        } catch(err) {
            error =(
                <span className='--error'>{ this.props.message.data[1].error }</span>
            );
        }

        return (
            <div className='screeps-console__message native-key-bindings' tabIndex={ -1 }>
                { timestamp }
                { shard }
                { message }
                { error }
            </div>
        );
    }
}

export default ConsoleMessageItemView;
