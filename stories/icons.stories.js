import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


storiesOf('UI Elements|Icons', module)
    .add('View', () => (
        <div className='screeps-ide storybook-ui-elements-icons'>
            <div className='sc-icon-revert'></div>
            <div className='sc-icon-more'></div>
            <div className='sc-icon-arrow_drop'></div>
            <div className='sc-icon-arrow_right'></div>
            <div className='sc-icon-done'></div>
            <div className='sc-icon-cached'></div>
            <div className='sc-icon-dehaze'></div>
            <div className='sc-icon-view'></div>
            <div className='sc-icon-copy'></div>
            <div className='sc-icon-delete'></div>
            <div className='sc-icon-pause'></div>
            <div className='sc-icon-play'></div>
            <div className='sc-icon-clear'></div>
            <div className='sc-icon-chevron'></div>
            <div className='sc-icon-screeps'></div>
        </div>
    ));
