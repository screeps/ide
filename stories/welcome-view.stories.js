import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as WelcomeView } from '../ui/components/welcome-view';

storiesOf('Welcome View', module)
    .add('1', () => (
        <WelcomeView
            showOnStartup={ true }
            onChangeShowOnStartup={() => {}}
        />
    ));

