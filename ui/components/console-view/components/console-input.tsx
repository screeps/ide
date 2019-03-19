import * as React from 'react';

interface IConsoleInputViewProps {
    onInput?: Function;
}

class ConsoleInputView extends React.Component<IConsoleInputViewProps> {
    constructor(props: IConsoleInputViewProps) {
        super(props);
    }

    onKeyPressHandler = (event: any) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (!event.target.value) {
            return;
        }

        this.props.onInput && this.props.onInput(event.target.value);

        event.target.value = '';
    }

    onSubmit = (event: any) => {
        event.preventDefault();
    }

    public render() {
        return (
            <div className='screeps-console__input'>
                <form onSubmit={ this.onSubmit }>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='Command...'

                            autoComplete=''

                            onKeyPress={ this.onKeyPressHandler }/>
                        <div className='underline' />
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default ConsoleInputView;
