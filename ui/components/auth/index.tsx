import * as React from 'react';
// import './style.css';

// @ts-ignore: 
// const vscode = acquireVsCodeApi();

// import { Subject } from 'rxjs';
export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IAuthModalProps {
    onCancel?: Function;
    onSubmit?: Function;
}

interface ICredentials {
    [key: string]: String;
}

class AuthModal extends React.Component<IAuthModalProps> {

    // public props: IAuthModalProps;
    // public onCancel: Function = () => {};

    private _data: ICredentials = {};

    constructor(props: IAuthModalProps) {
        // super(props);
        super(props);

        console.log(props, this);

        // this.onCancel = 
        // this.onChange = this.onChange.bind(this);
    }
    

    onCancel = () => {
        console.log('onCancel');

        if (this.props.onCancel) {
            this.props.onCancel();
        }
        

        // window.addEventListener('message', event => {

        //     const message = event.data; // The JSON data our extension sent

        //     switch (message.command) {
        //         case 'refactor':
        //             count = Math.ceil(count * 0.5);
        //             counter.textContent = count;
        //             break;
        //     }
        // });
    };

    onSubmit = () => {
        console.log('onSubmit');

        if (this.props.onSubmit) {
            this.props.onSubmit(this._data);
        }
    }

    onInput = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        const name = target.name;
        const value = target.value;

        this._data[name] = value;
    }

    public render() {
        return (
            <div className='screeps-modal screeps-auth-modal'>
                <header>
                    <div className='logotype' />
                    <button className='btn _cross' onClick={this.onCancel}/>
                </header>
                <form>
                    <fieldset>
                        <input type='text' name='email' required={ true } onChange={this.onInput} className='native-key-bindings' />
                        <label>E-mail or username</label>
                        <div className='underline' />
                    </fieldset>
                    <fieldset>
                        <input type='password' name='password' required={ true }  onChange={this.onInput} className='native-key-bindings' />
                        <label>Password</label>
                        <div className='underline' />
                    </fieldset>
                </form>
                <footer>
                    <button className='btn btn--transparent' onClick={this.onCancel}>Cancel</button>
                    <button className='btn btn--primary' type='submit' onClick={this.onSubmit}>Sign In</button>
                </footer>
            </div>
        );
    }
}

export default AuthModal;
