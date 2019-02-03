import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IConfirmModalProps {
    submitBtn?: string;
    legend?: string;

    onCancel?: Function;
    onSubmit?: Function;
}

interface IConfirmModalState {
    submitBtn?: string;
    legend: string;
}

class ConfirmModal extends React.Component<IConfirmModalProps> {
    //@ts-ignore
    props: IConfirmModalProps;
    state: IConfirmModalState;

    constructor(props: IConfirmModalProps) {
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
                    </fieldset>
                </form>
                <footer>
                    <button
                        className='btn btn--big btn--transparent'
                        onClick={this.onCancel}
                    >Cancel</button>
                    <button
                        className='btn btn--big btn--primary' type='submit'
                        onClick={this.onSubmit}
                    >{ this.state.submitBtn }</button>
                </footer>
            </div>
        );
    }

    // Public component output actions.
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    onSubmit = () => {
        this.setState({ });

        this.props.onSubmit && this.props.onSubmit();
    }
}

export default ConfirmModal;
