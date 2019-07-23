import React from 'react';
import { useState, useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as MemoryView } from '../ui/components/memory-view';
import {
    MEMORY_MAIN_VIEW,
    MEMORY_SEGMENTS_VIEW,
    default as MemoryControlsView
} from '../ui/components/memory-view/components/controls';

import { shards, memory } from './data';

let timeoutId;
const _memory = memory;
function MemoryViewIteration() {
    const path = {
        path: 'time',
        value: now()
    };
    const [memory, setMemory] = useState([..._memory, path]);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const value = now();
        memory[memory.length - 1] = {
            ...path,
            value
        };

        setMemory([...memory]);
    }, 2000);

    return (
        <MemoryView
            view={ MEMORY_MAIN_VIEW }

            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }
        />
    );

    function now() {
        return new Date() .getTime();
    }
}

storiesOf('UI Components|Memory View', module)
    .add('Iterate', () => (
        <MemoryViewIteration />
    ))
    .add('Main View', () => (
        <MemoryView
            view={ MEMORY_MAIN_VIEW }

            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }
        />
    ))
    .add('Segment No Data', () => (
        <MemoryView
            view={ MEMORY_SEGMENTS_VIEW }

            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }
        />
    ))
    .add('Segment Has Data', () => (
        <MemoryView
            view={ MEMORY_SEGMENTS_VIEW }

            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }
            segment={ '0' }
            segmentData={ 'segment 0' }
        />
    ))
    .add('Segment Loading', () => (
        <MemoryView
            view={ MEMORY_SEGMENTS_VIEW }

            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }

            isProgressing={ true }
        />
    ));
