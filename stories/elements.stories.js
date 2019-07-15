import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as Authiew } from '../ui/components/auth-view';

storiesOf('UI Elements|Buttons', module)
    .add('View', () => (
        <div className='screeps-ide storybook-ui-elements-buttons'>
            <div>
                <div>Enabled</div>
                <div>Hover</div>
                <div>Focused</div>
                <div>Pressed</div>
                <div>Disabled</div>
            </div>
            <div>
                <div>
                    <button
                        className='btn btn--big btn--primary' type='button'
                    >Primary</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--hover' type='button'
                    >Primary</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--focus' type='button'
                    >Primary</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--active' type='button'
                    >Primary</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary' type='button'
                        disabled={ true }
                    >Primary</button>
                </div>
            </div>
            <div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Transparent</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Transparent</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Transparent</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Transparent</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                        disabled={ true }
                    >Transparent</button>
                </div>
            </div>
        </div>
    ));
