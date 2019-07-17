import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as ConfirmView } from '../ui/components/confirm';

storiesOf('UI Components|Confirm View', module)
    .add('View', () => (
        <ConfirmView />
    ));
