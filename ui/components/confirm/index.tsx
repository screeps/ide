import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IConfirmModalProps {
    legend?: string;
    submitBtn?: string;

    onCancel?(): void;
    onSubmit?(): void;
}

export default function({
    legend,
    submitBtn,

    onCancel: cancel,
    onSubmit: submit
}: IConfirmModalProps) {
    legend = legend || 'Are you sure? Do you want execute it?';
    submitBtn = submitBtn || 'Ok';

    return (
        <div className='screeps-ide screeps-modal screeps-auth-modal'>
            <header>
                <div className='logotype' />
                <button className='btn _cross' onClick={ onCancel }/>
            </header>
            <form className='--indented'>
                <legend>{ legend }</legend>
            </form>
            <footer>
                <button
                    className='btn btn--big btn--transparent'
                    onClick={ onCancel }
                >Cancel</button>
                <button
                    className='btn btn--big btn--primary' type='submit'
                    onClick={ onSubmit }
                >{ submitBtn }</button>
            </footer>
        </div>
    );

    // Public component output actions.
    function onCancel() {
        cancel && cancel();
    }

    function onSubmit() {
        submit && submit();
    }
}
