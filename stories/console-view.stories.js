import React from 'react';
import { useState, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as ConsoleView } from '../ui/components/console-view';

const shards = [{
    name: 'shard0'
}, {
    name: 'shard1'
}, {
    name :'shard2'
}, {
    name: 'shard3'
}];

const log = {
    log: '234',
    shard: 'shard3',
    timeStamp: 1563204231657
};

const input = {
    expression: 'console.log(234)'
};

const output = {
    result: 'undefined'
};

const error = {
    error: 'ReferenceError: asd is not defined\n    at eval (eval at &lt;anonymous> (_console1563204406339_0:1:46), &lt;anonymous>:1:1)\n    at _console1563204406339_0:1:46\n    at _console1563204406339_0:1:60\n    at Object.exports.evalCode (&lt;runtime>:15958:71)\n    at Object.exports.run (&lt;runtime>:30494:41)\n',
    shard: 'shard3',
    timeStamp: 1563204407549
}

const messages = [input, log, output, error];

let i = 0;
let timeoutId;

function ConsoleMessagesIteration() {
    const [messages, setMessages] = useState([{
        log: `iterate message ${ i }`,
        shard: 'shard3',
        timeStamp: new Date() .getTime()
    }]);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        setMessages([...messages, {
            log: `iterate message ${ ++i }`,
            shard: 'shard3',
            timeStamp: new Date() .getTime()
        }]);

    }, 2000);

    return (
        <ConsoleView
            shard={ shards[2].name }
            shards={ shards }
            messages={ messages }

            onClean={() => {
                setMessages([]);
            }}
        />
    );
}

storiesOf('UI Components|Console View', module)
    .add('Iterate', () => (
        <ConsoleMessagesIteration />
    ))
    .add('All', () => (
        <ConsoleView
            shard={ shards[2].name }
            shards={ shards }

            messages={ messages }
        />
    ))
    .add('Input/Output', () => (
        <ConsoleView
            shard={ shards[2].name }
            shards={ shards }

            messages={ [input, log, output] }
        />
    ))
    .add('Error', () => (
        <ConsoleView
            shard={ shards[2].name }
            shards={ shards }

            messages={ [error] }
        />
    ));
