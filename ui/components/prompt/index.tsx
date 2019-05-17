import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IPromptModalProps {
    submitBtn?: string;
    legend?: string;

    onCancel?: Function;
    onSubmit?: Function;
}

interface IPromptModalState {
    submitBtn?: string;
    legend: string;
}

class PromptModal extends React.Component<IPromptModalProps> {
    //@ts-ignore
    props: IPromptModalProps;
    state: IPromptModalState;

    message: string = '';

    constructor(props: IPromptModalProps) {
        super(props);

        this.state = {
            legend: props.legend || 'Are you sure? Do you want execute it?',
            submitBtn: props.submitBtn || 'Ok'
        }
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
                        <legend>{ this.state.legend }</legend>
                        <input
                            className='native-key-bindings'

                            type='text'
                            name='message'

                            onChange={this.onInput}

                            required={ true }
                            autoFocus={ true }
                        />
                        <div className='underline' />
                    </fieldset>
                </form>
                <footer>
                    <button
                        className='btn btn--big btn--transparent'
                        onClick={this.onCancel}
                    >Cancel</button>
                    <button
                        className='btn btn--big btn--primary' type='submit'
                        disabled={ !this.message }

                        onClick={this.onSubmit}
                    >{ this.state.submitBtn }</button>
                </footer>
            </div>
        );
    }

    // Private component actions.
    private onInput = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        this.message = target.value; 

        this.setState({ ...this.state });
    }

    // Public component output actions.
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    onSubmit = () => {
        this.setState({ });

        this.props.onSubmit && this.props.onSubmit(this.message);
    }
}

export default PromptModal;
