import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IAuthModalProps {
    onCancel?: Function;
    onSubmit?: Function;
}

interface IAuthModalState {
    isBlocking: boolean;
}

interface ICredentials {
    [key: string]: String;
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
            isBlocking: false
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
                <form>
                    <fieldset className='screeps-field'>
                        <input ref={ this._emailRef }
                            className='native-key-bindings'

                            type='text'
                            name='email'

                            onChange={this.onInput}

                            disabled={ this.state.isBlocking }
                            required={ true }

                            tabIndex={ 1 }/>
                        <label>E-mail or username</label>
                        <div className='underline' />
                    </fieldset>
                    <fieldset className='screeps-field'>
                        <input ref={ this._passwordRef }
                            className='native-key-bindings'

                            type='password'
                            name='password'

                            onChange={this.onInput} 

                            disabled={ this.state.isBlocking }
                            required={ true }

                            tabIndex={ 2 }/>
                        <label>Password</label>
                        <div className='underline' />
                    </fieldset>
                </form>
                <footer>
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
    private onInput = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        const name = target.name;
        const value = target.value;

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
