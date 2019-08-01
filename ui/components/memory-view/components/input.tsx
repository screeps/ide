import * as React from 'react';
import { useState } from 'react';

interface IMemoryInputViewProps {
    onInput?(name: string): void;
}

export default function({
    onInput
}: IMemoryInputViewProps) {
    const [value, setValue] = useState('');

    return (
        <div className='screeps-memory__input'>
            <form onSubmit={ onSubmit }>
                <fieldset className='screeps-field'>
                    <input
                        className='native-key-bindings'

                        type='text'
                        placeholder='Add new memory watch path here, e.g. "creeps.John"'

                        autoComplete=''

                        onChange={ onChange }

                        value={ value }/>
                    <div className='underline' />
                </fieldset>
            </form>
        </div>
    );

    function onChange(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setValue(value);
    }

    function onSubmit(event: React.FormEvent) {
        onInput && onInput(value);
        setValue('');

        event.preventDefault();
    }
}
