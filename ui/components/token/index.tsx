import * as React from 'react';

export const MODAL_CLOSE = 'MODAL_CLOSE';

interface ITokenModalProps {
    token: string;

    onCancel?: Function;
    onSubmit?: Function;
}

export default function(props: ITokenModalProps) {
    return (
        <div className='screeps-ide screeps-modal screeps-auth-modal'>
            <header>
                <div className='logotype' />
                <button className='btn _cross' onClick={onCancel}/>
            </header>
            <form className='--indented' onSubmit={ onSubmit }>
                <fieldset className='screeps-field'>
                    <legend>This auth token will be saved to your preferences:</legend>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='email'

                        required={ true }
                        readOnly={ true }

                        value={ props.token.substr(0, 8) + '-****-****-****-************' }
                    />
                    <div className='underline' />
                </fieldset>
            </form>
            <footer>
                <button className='btn btn--big btn--transparent' onClick={onCancel} type='button'>Cancel</button>
                <button className='btn btn--big btn--primary' type='submit' onClick={ onSubmit }>Ok</button>
            </footer>
        </div>
    );

    // Public component output actions.
    function onCancel() {
        props.onCancel && props.onCancel();
    }

    function onSubmit() {
        props.onSubmit && props.onSubmit();
    }
};
