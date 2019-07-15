import * as React from 'react';

interface IConsoleMessageItemViewProps {
    message: any
}

function unescapeHTML(escapedHTML: string) {
    return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

export default function(props: IConsoleMessageItemViewProps) {
    let timestamp, shard, message, error;

    if (props.message.timeStamp) {
        timestamp = (
            <span className='--timestamp'>
                <span className='brackets'>
                    { new Date(props.message.timeStamp) .toLocaleTimeString() }
                </span>
                &nbsp;
            </span>
        );
    }

    if (props.message.shard) {
        shard = (
            <span>
                <span className='brackets'>
                    { props.message.shard }
                </span>
                &nbsp;
            </span>
        );
    }

    if (props.message.log) {
        message = (
            <span className='--log'>{ unescapeHTML(props.message.log) }</span>
        );
    }

    if (props.message.expression) {
        message = (
            <span className='--input'>{ unescapeHTML(props.message.expression) }</span>
        );
    }

    if (props.message.result) {
        message = (
            <span className='--output'>{ unescapeHTML(props.message.result) }</span>
        );
    }

    if (props.message.error) {
        error =(
            <span className='--error'>{ unescapeHTML(props.message.error) }</span>
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
