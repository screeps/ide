import React from 'react';

import { storiesOf } from '@storybook/react';

import { default as WelcomeView } from '../ui/components/welcome-view';

storiesOf('UI Components|Welcome View', module)
    .add('View', () => (
        <WelcomeView
            showOnStartup={ true }
            onChangeShowOnStartup={() => {}}
        />
    ));

