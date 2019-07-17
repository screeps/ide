import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as Authiew } from '../ui/components/auth-view';

storiesOf('UI Elements|Form Controls', module)
    .add('Inputs', () => (
        <div className='screeps-ide'>
            <form className='--indented'>
                <fieldset className='screeps-field'>
                    <legend>Fixed name</legend>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='message'

                        required={ true }
                        autoFocus={ true }

                        tabIndex={ 1 }
                    />
                    <div className='underline' />
                </fieldset>
            </form>

            <form className='--indented'>
                <fieldset className='screeps-field'>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='email'
                        placeholder=' '

                        required={ true }

                        autoComplete='off'
                        tabIndex={ 1 }/>
                    <label>Float name</label>
                    <div className='underline' />
                </fieldset>
            </form>

            <form className='--invalid --indented'>
                <fieldset className='screeps-field'>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='email'
                        placeholder=' '

                        required={ true }

                        autoComplete='off'
                        tabIndex={ 1 }/>
                    <label>Error</label>
                    <div className='underline' />
                </fieldset>
                <div className='error'>Account credentials are invalid</div>
            </form>

            <form className='--indented'>
                <fieldset className='screeps-field'>
                    <input 
                        className='native-key-bindings'

                        type='text'
                        placeholder='placeholder'

                        autoComplete=''
                        tabIndex={ 1 }/>
                    <div className='underline' />
                </fieldset>
            </form>

            <form className=''>
                <fieldset className='screeps-field'>
                    <input 
                        className='native-key-bindings'

                        type='text'
                        placeholder='without indents'

                        autoComplete=''
                        tabIndex={ 1 }/>
                    <div className='underline' />
                </fieldset>
            </form>
        </div>
    ));
