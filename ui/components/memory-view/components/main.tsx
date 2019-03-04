import * as React from 'react';

import { default as MemoryItemView } from './item';
import { default as MemoryInputView } from './input';

interface IMemoryMainViewProps {
    watches: any[];

    onClick?: Function;
    onDelete?: Function;
    onInput?: Function;
}

export default class MemoryMainView extends React.Component<IMemoryMainViewProps> {
    //@ts-ignore
    props: IMemoryMainViewProps;

    constructor(props: IMemoryMainViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className='screeps-memory__main'>
                <div className='screeps-memory__main-items'>
                    { this.props.watches.map((item, index) => {
                        // console.log(item);
                        return (<MemoryItemView
                            key={ index }
                            item={ item }

                            onClick={ this.onClick }
                            onDelete={ this.onDelete }
                        />)
                    })}
                </div>
                <hr className='screeps-hr' />
                <MemoryInputView onInput={ this.onInput } />
            </div>
        );
    }

    onClick = (data: any) => {
        this.props.onClick && this.props.onClick(data);
    }

    onDelete = (data: any) => {
        this.props.onDelete && this.props.onDelete(data);
    }

    onInput = (data: any) => {
        this.props.onInput && this.props.onInput(data);
    }
}
