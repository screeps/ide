import * as React from 'react';

interface IMemoryInputViewProps {
    onInput?: Function;
}

class MemoryInputView extends React.Component<IMemoryInputViewProps> {
    constructor(props: IMemoryInputViewProps) {
        super(props);
    }

    onKeyPressHandler = (event: any) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (!event.target.value) {
            return;
        }

        this.props.onInput && this.props.onInput({ expression: event.target.value });

        event.target.value = '';
    }

    onSubmit = (event: any) => {
        event.preventDefault();
    }

    public render() {
        return (
            <div className='screeps-memory__input'>
                <form onSubmit={ this.onSubmit }>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='Add new memory watch path here, e.g. "creeps.Jhon"'

                            autoComplete=''

                            onKeyPress={ this.onKeyPressHandler }/>
                        <div className='underline' />
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default MemoryInputView;
