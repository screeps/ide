import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as MemoryView } from '../ui/components/memory-view';

import { shards, memory } from './data';

storiesOf('UI Components|Memory View', module)
    .add('View', () => (
        <MemoryView
            shard={ shards[1].name }
            shards={ shards }

            memory={ memory }
        />
    ));
