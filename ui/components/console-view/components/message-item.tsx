import * as React from 'react';

interface IConsoleMessageItemViewProps {
    message: any
}

function unescapeHTML(escapedHTML: string) {
    return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

class ConsoleMessageItemView extends React.Component<IConsoleMessageItemViewProps> {
    constructor(props: IConsoleMessageItemViewProps) {
        super(props);
    }

    public render() {
        let timestamp, shard, message, error;

        if (this.props.message.timeStamp) {
            timestamp = (
                <span className='--timestamp'>
                    <span className='brackets'>
                        { new Date(this.props.message.timeStamp) .toLocaleTimeString() }
                    </span>
                    &nbsp;
                </span>
            );
        }

        if (this.props.message.shard) {
            shard = (
                <span>
                    <span className='brackets'>
                        { this.props.message.shard }
                    </span>
                    &nbsp;
                </span>
            );
        }

        if (this.props.message.log) {
            message = (
                <span className='--log'>{ unescapeHTML(this.props.message.log) }</span>
            );
        }

        if (this.props.message.expression) {
            message = (
                <span className='--input'>{ unescapeHTML(this.props.message.expression) }</span>
            );
        }

        if (this.props.message.result) {
            message = (
                <span className='--output'>{ unescapeHTML(this.props.message.result) }</span>
            );
        }

        if (this.props.message.error) {
            error =(
                <span className='--error'>{ unescapeHTML(this.props.message.error) }</span>
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
