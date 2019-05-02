import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface ITokenModalProps {
    token: string;

    onCancel?: Function;
    onSubmit?: Function;
}

interface ITokenModalState {
}

class TokenModal extends React.Component<ITokenModalProps> {
    //@ts-ignore
    props: ITokenModalProps;
    state: ITokenModalState;

    constructor(props: ITokenModalProps) {
        super(props);

        this.state = { };
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
                        <legend>It'll be save to global config</legend>
                        <input
                            className='native-key-bindings'

                            type='text'
                            name='email'

                            required={ true }
                            readOnly={ true }

                            value={ this.props.token.substr(0, 8) + '-****-****-****-************' }
                        />
                        <div className='underline' />
                    </fieldset>
                </form>
                <footer>
                <button className='btn btn--big btn--transparent' onClick={this.onCancel}>Cancel</button>
                    <button
                        className='btn btn--big btn--primary' type='submit' onClick={this.onSubmit}
                    >Ok</button>
                </footer>
            </div>
        );
    }

    // Public component output actions.
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    }

    onSubmit = () => {
        this.props.onSubmit && this.props.onSubmit();
    }
}

export default TokenModal;
