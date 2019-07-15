import React from 'react';

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

const messages = [{
    log: 'default message',
    shard: 'shard3',
    timeStamp: 1563204231657
}, {
    expression: 'console.log(234)'
}, {
    result: 'undefined'
}, {
    error: 'ReferenceError: asd is not defined\n    at eval (eval at &lt;anonymous> (_console1563204406339_0:1:46), &lt;anonymous>:1:1)\n    at _console1563204406339_0:1:46\n    at _console1563204406339_0:1:60\n    at Object.exports.evalCode (&lt;runtime>:15958:71)\n    at Object.exports.run (&lt;runtime>:30494:41)\n',
    shard: 'shard3',
    timeStamp: 1563204407549
}];

storiesOf('UI Components|Console View', module)
    .add('View', () => (
        <ConsoleView
            shard={ shards[2].name }
            shards={ shards }

            messages={ messages }
        />
    ));
