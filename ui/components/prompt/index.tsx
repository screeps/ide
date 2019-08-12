import * as React from 'react';
import { useState } from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface IPromptModalProps {
    legend?: string;
    submitBtn?: string;

    onInput?: Function;
    onCancel?: Function;
    onSubmit?: Function;
}

export default function({
    legend,
    submitBtn,

    onInput: input,
    onCancel: cancel,
    onSubmit: submit
}: IPromptModalProps) {
    const [message, setMessage] = useState('');
    const [warning, setWarning] = useState('');

    legend = legend || 'Are you sure? Do you want execute it?';
    submitBtn = submitBtn || 'Ok';

    return (
        <div className='screeps-ide screeps-modal screeps-auth-modal'>
            <header>
                <div className='logotype' />
                <button className='btn _cross' onClick={ onCancel }/>
            </header>
            <form className={ ['--indented', warning ? '--warning' : ''].join(' ') } onSubmit={ onSubmit }>
                <fieldset className='screeps-field'>
                    <legend>{ legend }</legend>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='message'

                        onChange={ onInput }

                        required={ true }
                        autoFocus={ true }

                        tabIndex={ 1 }
                    />
                    <div className='underline' />
                </fieldset>
                <div className='warning'>{ warning }</div>
            </form>
            <footer>
                <button
                    className='btn btn--big btn--transparent'
                    onClick={ onCancel }

                    tabIndex={ 2 }
                >Cancel</button>
                <button
                    className='btn btn--big btn--primary' type='submit'
                    disabled={ !message }

                    onClick={ onSubmit }

                    tabIndex={ 3 }
                >{ submitBtn }</button>
            </footer>
        </div>
    );

    // Private component actions.
    function onInput(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;

        setMessage(target.value);

        try {
            const { warning } = (input && input(target.value));
            setWarning(warning);
        } catch(err) {
            setWarning('');
        }
    }

    // Public component output actions.
    function onCancel() {
        cancel && cancel();
    }

    function onSubmit() {
        submit && submit(message);
    }
}
