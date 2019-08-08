/// <reference path='./index.d.ts' />

import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

// @ts-ignore
export function validate(target: any, name: any, descriptor: any) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        let result;
        try {
            result = await original.apply(this, args);
        } catch (err) {
            // Noop.
        }

        let isBlocking = true;
        if (this._data.email && this._data.password) {
            isBlocking = false;
        }

        this.setState({
            ...this.state,
            isInvalid: false,
            isBlocking
        });

        return result;
    };

    return descriptor;
}

export default class AuthView extends React.Component<IAuthModalProps> {
    //@ts-ignore
    props: IAuthModalProps;
    state: IAuthModalState;

    private _data: ICredentials = {};

    private _emailRef: any;
    private _passwordRef: any;

    constructor(props: IAuthModalProps) {
        super(props);

        this.state = {
            isInvalid: false,
            isBlocking: true
        };

        this._emailRef = React.createRef();
        this._passwordRef = React.createRef();
    }

    public render() {
        return (
            <div className='screeps-ide screeps-modal screeps-auth-modal'>
                <header>
                    <div className='logotype' />
                    <button className='btn _cross' onClick={this.onCancel}/>
                </header>
                <div>Your credentials are only used to create an auth token, password will not be stored.</div>
                <form className={ ['--indented', this.state.isInvalid ? '--invalid' : ''].join(' ') }>
                    <fieldset className='screeps-field'>
                        <input ref={ this._emailRef }
                            className='native-key-bindings'

                            type='text'
                            name='email'
                            placeholder=' '

                            onChange={(event: React.ChangeEvent) => this.onInput(event)}

                            required={ true }

                            autoComplete='off'
                            tabIndex={ 1 }/>
                        <label>E-mail or username</label>
                        <div className='underline' />
                    </fieldset>
                    <fieldset className='screeps-field'>
                        <input ref={ this._passwordRef }
                            className='native-key-bindings'

                            type='password'
                            name='password'
                            placeholder=' '

                            onChange={(event: React.ChangeEvent) => this.onInput(event)}

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
                        <a href='https://screeps.com/a/#!/register' target='_blank'>Create a new account</a>
                        <a href='https://screeps.com/a/#!/register/ask-recover' target='_blank'>I forgot my password</a>
                    </div>
                    <button
                        className='btn btn--big btn--transparent'
                        onClick={this.onCancel}

                        tabIndex={ 3 }
                    >Cancel</button>
                    <button
                        className='btn btn--big btn--primary' type='submit' onClick={this.onSubmit}
                        disabled={ this.state.isBlocking }

                        tabIndex={ 4 }
                    >Sign In</button>
                </footer>
            </div>
        );
    }

    // Private component actions.
    @validate
    async onInput(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;

        const name = target.name;
        const value = target.value;

        // @ts-ignore
        this._data[name] = value;
    }

    // Public component output actions.
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    onSubmit = () => {
        this.setState({
            isBlocking: true
        });

        this.props.onSubmit && this.props.onSubmit(this._data);
    }
}
