import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as PromptView } from '../ui/components/prompt';

storiesOf('UI Components|Prompt View', module)
    .add('Default', () => (
        <PromptView />
    ))
    .add('With warning', () => (
        <PromptView 
            legend='Try input name from list one, two, three.'
            onInput={ (value) => {
                if (!['one', 'two', 'three'].includes(value)) {
                    return;
                }

                return {
                    warning: `Value ${ value } in list`
                };
            }}
        />
    ));
