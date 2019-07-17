import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as PromptView } from '../ui/components/prompt';

storiesOf('UI Components|Prompt View', module)
    .add('View', () => (
        <PromptView />
    ));
