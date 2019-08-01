import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as BranchesView } from '../ui/components/branches-view';

const branch = 'default';
const branches = [{
    _id: '1',
    branch: 'default',
    activeWorld: true
}, {
    _id: '2',
    branch: 'simulation',
    activeSim: true
}, {
    _id: '3',
    branch: 'tutorial'
}];

storiesOf('UI Components|Branches View', module)
    .add('View', () => (
        <atom-dock>
            <BranchesView
                branch={ branch }
                branches={ branches }
            />
        </atom-dock>
    ))
    .add('View Progressing', () => (
        <atom-dock>
            <BranchesView
                isProgressing={ true }

                branch={ branch }
                branches={ branches }
            />
        </atom-dock>
    ))
    .add('View Active Branch', () => (
        <atom-dock>
            <BranchesView
                branch={ branch }
                branches={ branches }

                active={ 'simulation' }
            />
        </atom-dock>
    ));
