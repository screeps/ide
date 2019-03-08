import * as React from 'react';

import { default as MemoryItemView } from './item';
import { default as MemoryInputView } from './input';

interface IMemoryMainViewProps {
    watches: any[];

    onClick?: Function;
    onDelete?: Function;
    onInput?: Function;
    onSave?: Function;
    onReload?: Function;
}

interface IMemoryMainViewState {
    watches: any[];
}

export default class MemoryMainView extends React.Component<IMemoryMainViewProps> {
    //@ts-ignore
    props: IMemoryMainViewProps;

    state: IMemoryMainViewState;

    constructor(props: IMemoryMainViewProps) {
        super(props);

        this.state = {
            watches: props.watches
        }
    }

    componentWillReceiveProps(nextProps: IMemoryMainViewProps) {
        if (nextProps.watches) {
            this.setState({
                watches: nextProps.watches
            });
        }
    }

    public render() {
        return (
            <div className='screeps-memory__main'>
                <div className='screeps-memory__main-items'>
                    { this.state.watches.map(({ path, data, value }, index) => {
                        // console.log(item);
                        return (<MemoryItemView key={ index }
                            path={ path }
                            data={ data }
                            value={ value }

                            onClick={ () => this.onClick(path) }
                            onReload={ () => this.onReload(path) }
                            onDelete={ this.onDelete }
                            onSave={ (value: any) => this.onSave(path, value) }
                        />)
                    })}
                </div>
                <hr className='screeps-hr' />
                <MemoryInputView onInput={ this.onInput } />
            </div>
        );
    }

    onClick = (path: string) => {
        this.props.onClick && this.props.onClick(path);
    }

    onReload = (path: string) => {
        this.props.onReload && this.props.onReload(path);
    }

    onSave = (path: string, value: any) => {
        this.props.onSave && this.props.onSave(path, value);
    }

    onDelete = (data: any) => {
        this.props.onDelete && this.props.onDelete(data);
    }

    onInput = (data: any) => {
        this.props.onInput && this.props.onInput(data);
    }
}
