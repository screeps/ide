import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as CreateProjectView } from '../ui/components/create-project-view';

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

storiesOf('UI Components|Create Project View', module)
    .add('Create', () => (
        <CreateProjectView 
            branch={ branch }
            branches={ branches }
        />
    ))
    .add('Download', () => (
        <CreateProjectView 
            branch={ branch }
            branches={ branches }

            projectPath={ '/some/project/path' }
            projectPathLabel={ 'Project folder path' }
            projectPathReadonly={ true }

            downloadReadonly={ true }
            submitBtn={ 'Download' }
        />
    ));
