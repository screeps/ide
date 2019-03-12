import * as React from 'react';

import { default as MemoryItemView } from './item';
import { default as MemoryInputView } from './input';

interface IMemoryMainViewProps {
    memory: IMemoryPath[];

    onClick?: Function;
    onDelete?: Function;
    onInput?: Function;
    onSave?: Function;
    onReload?: Function;
    onRemovePath?: Function;
}

interface IMemoryMainViewState {
    memory: IMemoryPath[];
}

export default class MemoryMainView extends React.Component<IMemoryMainViewProps> {
    //@ts-ignore
    props: IMemoryMainViewProps;

    state: IMemoryMainViewState;

    constructor(props: IMemoryMainViewProps) {
        super(props);

        this.state = {
            memory: props.memory
        }
    }

    componentWillReceiveProps(nextProps: IMemoryMainViewProps) {
        if (nextProps.memory) {
            this.setState({
                memory: nextProps.memory
            });
        }
    }

    public render() {
        return (
            <div className='screeps-memory__main'>
                <div className='screeps-memory__main-items'>
                    { this.state.memory.map(({ path, value }) => {
                        return (<MemoryItemView key={ path }
                            path={ path }
                            value={ value }

                            onClick={ () => this.onClick(path) }
                            onReload={ () => this.onReload(path) }
                            onDelete={ () => this.onDelete(path) }
                            onSave={ (value: any) => this.onSave(path, value) }
                            onRemovePath={ () => this.onRemovePath(path) }
                        />)
                    })}
                </div>
                <hr className='screeps-hr' />
                <MemoryInputView onInput={ this.onInput } />
            </div>
        );
    }

    onClick = async (path: string): Promise<void> => {
        this.props.onClick && await this.props.onClick(path);
    }

    onReload = (path: string) => {
        this.props.onReload && this.props.onReload(path);
    }

    onSave = (path: string, value: any) => {
        this.props.onSave && this.props.onSave(path, value);
    }

    onDelete = (path: string) => {
        this.props.onDelete && this.props.onDelete(path);
    }

    onRemovePath = (path: string) => {
        this.props.onRemovePath && this.props.onRemovePath(path);
    }

    onInput = (path: string) => {
        this.props.onInput && this.props.onInput(path);
    }
}
