import React from 'react';

import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { default as WelcomeView } from '../ui/components/welcome-view';

storiesOf('UI Components|Welcome View', module)
    .add('View', () => (
        <WelcomeView
            showOnStartup={ true }
            onSignin={ linkTo('UI Components|Auth View', 'Clear') }
            onCreateNewProject={ linkTo('UI Components|Create Project View', 'Create') }
            onChangeShowOnStartup={() => {}}
        />
    ));

