import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as ModulesView } from '../ui/components/modules-view';

const branch = 'default';
const modules = {
    'role.builder': {
        modified: true
    },
    'role.harvester': {
    },
    'role.upgrader': {}
};

storiesOf('UI Components|Modules View', module)
    .add('View', () => (
        <atom-dock>
            <ModulesView
                branch={ branch }
                modules={ modules }

                active={ `@${ branch }/${ 'role.harvester' }.js` }
            />
        </atom-dock>
    ));
