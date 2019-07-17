import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

storiesOf('UI Elements|Buttons', module)
    .add('View', () => (
        <div className='screeps-ide storybook-ui-elements-buttons'>
            <div>
                <div></div>
                <div>Enabled</div>
                <div>Hover</div>
                <div>Focused</div>
                <div>Pressed</div>
                <div>Disabled</div>
            </div>
            <div>
                <div>Primary</div>
                <div>
                    <button
                        className='btn btn--big btn--primary' type='button'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--hover' type='button'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--focus' type='button'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary btn--active' type='button'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--primary' type='button'
                        disabled={ true }
                    >Button</button>
                </div>
            </div>
            <div>
                <div>Transparent</div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                    >Button</button>
                </div>
                <div>
                    <button
                        className='btn btn--big btn--transparent'
                        disabled={ true }
                    >Button</button>
                </div>
            </div>
        </div>
    ));
