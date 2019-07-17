/// <reference path='./index.d.ts' />

import * as React from 'react';

import { default as ConsoleControlsView } from './components/controls';
import { default as ConsoleMessagesListView } from './components/messages-list';
import { default as ConsoleInputView } from './components/console-input';

export default function(props: IConsoleViewProps) {
    return (
        <div className='screeps-ide screeps-console screeps-console__view'>
            <ConsoleControlsView
                shard={ props.shard || '' }
                shards={ props.shards || [] }
                paused={ props.paused || false }

                onShard={ props.onShard }
                onResume={ props.onResume }
                onPause={ props.onPause }
                onClean={ props.onClean }
            />
            <hr className='screeps-hr' />
            <ConsoleMessagesListView messages={ props.messages || []}/>
            <hr className='screeps-hr' />
            <ConsoleInputView onInput={ props.onInput }/>
        </div>
    );
}
