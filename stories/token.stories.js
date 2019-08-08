import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as TokenView } from '../ui/components/token';

storiesOf('UI Components|Token View', module)
    .add('View', () => (
        <TokenView token={ '7c173e04-1234-1234-1234-123412341234' } />
    ));
