import * as React from 'react';
import { useRef, useEffect } from 'react';

import { default as ConsoleMessageItemView } from './message-item';

interface IConsoleMessagesListViewProps {
    messages: any[]
}

let scrollToBottom = true;
export default function({ messages }: IConsoleMessagesListViewProps) {
    const messagesRef = useRef<HTMLDivElement>(null);
    const messagesBottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!messagesBottomRef.current || !scrollToBottom) {
            return;
        }

        // @ts-ignore
        messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='screeps-console__messages' ref={ messagesRef }
            onScroll={ onScroll }
        >
            {messages.map((message, index) => {
                return (<ConsoleMessageItemView key={ index } message={ message } />)
            })}
            <div ref={ messagesBottomRef } />
        </div>
    );

    function onScroll() {
        if (!messagesRef.current) {
            return;
        }

        const { offsetHeight, scrollHeight, scrollTop } = messagesRef.current;

        scrollToBottom = (scrollTop + offsetHeight) >= scrollHeight;
    }
}
