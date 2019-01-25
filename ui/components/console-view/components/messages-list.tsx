import * as React from 'react';

import { default as ConsoleMessageItemView } from './message-item';

interface IConsoleMessagesListViewProps {
    messages: any[]
}

interface IConsoleMessagesListViewState {
}

class ConsoleMessagesListView extends React.Component<IConsoleMessagesListViewProps> {
    //@ts-ignore
    props: IConsoleMessagesListViewProps;

    state: IConsoleMessagesListViewState;

    public messagesBottomRef: HTMLDivElement | null = null;

    constructor(props: IConsoleMessagesListViewProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <div className='screeps-console__messages'>
                {this.props.messages.map((message, index) => {
                    return (<ConsoleMessageItemView key={ index } message={ message } />)
                })}
                <div ref={(el) => this.messagesBottomRef = el} />
            </div>
        );
    }

    componentDidUpdate() {
        //@ts-ignore
        this.messagesBottomRef.scrollIntoView({ behavior: "smooth" });
    }
}

export default ConsoleMessagesListView;
