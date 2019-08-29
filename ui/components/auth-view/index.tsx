/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, forwardRef, useImperativeHandle } from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IState {
    isInvalid?: boolean;
    isBlocking?: boolean;
}

export default forwardRef(function(props: IAuthModalProps, ref) {
    const [state, setState] = useState<IState>({ });
    const [email, setEmailValue] = useState('');
    const [password, setPassValue] = useState('');

    useImperativeHandle(ref, () => ({
        setState(state: IState) {
            setState(state);
        }
    }));

    return (
        <div className='screeps-ide screeps-modal screeps-auth-modal'>
            <header>
                <div className='logotype' />
                <button className='btn _cross' onClick={onCancel}/>
            </header>
            <div>Your credentials are only used to create an auth token, password will not be stored.</div>
            <form onSubmit={onSubmit}
                className={ ['--indented', state.isInvalid ? '--invalid' : ''].join(' ') }>
                <fieldset className='screeps-field'>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='email'
                        placeholder=' '

                        value={ email }
                        onChange={onInputEmail}

                        required={ true }

                        autoComplete='off'
                        tabIndex={ 1 }/>
                    <label>E-mail or username</label>
                    <div className='underline' />
                </fieldset>
                <fieldset className='screeps-field'>
                    <input
                        className='native-key-bindings'

                        type='password'
                        name='password'
                        placeholder=' '

                        value={ password }
                        onChange={onInputPass}

                        required={ true }

                        autoComplete='off'
                        tabIndex={ 2 }/>
                    <label>Password</label>
                    <div className='underline' />
                </fieldset>
                <div className='error'>Account credentials are invalid</div>
            </form>
            <footer>
                <div>
                    <a href='https://screeps.com/a/#!/register' target='_blank' tabIndex={ 3 }>Create a new account</a>
                    <a href='https://screeps.com/a/#!/register/ask-recover' target='_blank' tabIndex={ 4 }>I forgot my password</a>
                </div>
                <button
                    className='btn btn--big btn--transparent' type='button'
                    onClick={onCancel}

                    tabIndex={ 5 }
                >Cancel</button>
                <button
                    className='btn btn--big btn--primary' type='button'
                    onClick={onSubmit}

                    disabled={ state.isBlocking || !email || !password }

                    tabIndex={ 6 }
                >Sign In</button>
            </footer>
        </div>
    );

    function onInputEmail(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setEmailValue(value);
        setState({ isBlocking: false });
    }

    function onInputPass(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setPassValue(value);
        setState({ isBlocking: false });
    }

    function onCancel() {
        props.onCancel && props.onCancel();
    }

    function onSubmit() {
        setState({ isBlocking: true });

        props.onSubmit && props.onSubmit({
            email,
            password
        });
    }
})

