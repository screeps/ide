import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as AuthView } from '../ui/components/auth-view';

storiesOf('UI Components|Auth View', module)
    .add('View', () => (
        <AuthView />
    ));
