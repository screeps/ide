import * as React from 'react';

interface IConsoleInputViewProps {
    onInput?(expression: string): void;
}

class ConsoleInputView extends React.Component<IConsoleInputViewProps> {
    private _inputRef = React.createRef<HTMLInputElement>();
    private _history: string[] = [];
    private _historyIndex: number = 0;

    constructor(props: IConsoleInputViewProps) {
        super(props);
    }

    componentDidMount() {
        if (!this._inputRef.current) {
            return;
        }

        this._inputRef.current.addEventListener('keyup', this.onKeyUpHandler);
        this._inputRef.current.addEventListener('keydown', this.onKeyDownHandler);
    }

    public render() {
        return (
            <div className='screeps-console__input'>
                <form onSubmit={ this.onSubmit }>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='Command...'
                            ref={ this._inputRef }

                            autoComplete=''

                            onKeyPress={ this.onKeyPressHandler }

                            tabIndex={ 0 }/>
                        <div className='underline' />
                    </fieldset>
                </form>
            </div>
        );
    }

    onKeyUpHandler = (event: any) => {
        console.log(event.key, this._historyIndex);
        if (event.key !== 'ArrowUp') {
            return;
        }

        if (!this._inputRef.current) {
            return;
        }

        if (this._historyIndex < this._history.length - 1) {
            this._historyIndex++;
            this._inputRef.current.value = this._history[this._historyIndex];

            return;
        }

        this._inputRef.current.value = '';
        this._historyIndex = this._history.length;
    }

    onKeyDownHandler = (event: any) => {
        console.log(event.key, this._historyIndex);
        if (event.key !== 'ArrowDown') {
            return;
        }

        if (!this._inputRef.current) {
            return;
        }

        if (this._historyIndex > 0) {
            this._historyIndex--;
            this._inputRef.current.value = this._history[this._historyIndex];

            return;
        }

        this._inputRef.current.value = '';
        this._historyIndex = -1;
    }

    onKeyPressHandler = (event: any) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (!event.target.value) {
            return;
        }

        this.props.onInput && this.props.onInput(event.target.value);
        this._history.unshift(event.target.value);

        event.target.value = '';
        this._historyIndex = -1;
    }

    onSubmit = (event: any) => {
        event.preventDefault();
    }

}

export default ConsoleInputView;
