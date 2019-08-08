import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

interface IConsoleInputViewProps {
    onInput?(expression: string): void;
}

export default function({
    onInput
}: IConsoleInputViewProps) {
    const [value, setValue] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        if (historyIndex >= 0 && historyIndex < history.length) {
            setValue(history[historyIndex]);
            return;
        }

        if (historyIndex === -1) {
            setValue('');
            return;
        }
    }, [historyIndex]);

    const inputRef = useRef(null);
    useEffect(() => {
        try {
            // @ts-ignore
            inputRef.current.focus();
        } catch(err) {
            // Noop.
        }
    }, [inputRef]);

    return (
        <div className='screeps-console__input'>
            <form onSubmit={ onSubmit }>
                <fieldset className='screeps-field'>
                    <input className='native-key-bindings' type='text' placeholder='Command...'
                        ref={ inputRef }
                        autoComplete=''

                        onChange={ onChange }
                        onKeyUp={ onKeyPress }

                        tabIndex={ 0 }

                        value={ value }/>
                    <div className='underline' />
                </fieldset>
            </form>
        </div>
    );

    function onKeyPress({ key }: React.KeyboardEvent) {
        switch(key) {
            case 'ArrowUp': {
                historyUp();
                break;
            }
            case 'ArrowDown': {
                historyDown();
                break;
            }
        }
    }

    function historyUp() {
        if (historyIndex >= (history.length - 1)) {
            return;
        }

        setHistoryIndex(historyIndex + 1);
    }

    function historyDown() {
        if (historyIndex < 0) {
            return;
        }

        setHistoryIndex(historyIndex - 1);
    }

    function onChange(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setValue(value);
    }

    function onSubmit(event: React.FormEvent) {
        onInput && onInput(value);
        setValue('');

        setHistory([value, ...history]);
        setHistoryIndex(-1);

        event.preventDefault();
    }
}
