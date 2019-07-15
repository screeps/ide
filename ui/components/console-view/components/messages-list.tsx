import * as React from 'react';
import { useRef, useEffect } from 'react';

import { default as ConsoleMessageItemView } from './message-item';

interface IConsoleMessagesListViewProps {
    messages: any[]
}

export default function({ messages }: IConsoleMessagesListViewProps) {
    const messagesBottomRef = useRef(null)

    useEffect(() => {
        if (!messagesBottomRef.current) {
            return;
        }

        // @ts-ignore
        messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='screeps-console__messages'>
            {messages.map((message, index) => {
                return (<ConsoleMessageItemView key={ index } message={ message } />)
            })}
            <div ref={ messagesBottomRef } />
        </div>
    );
}
