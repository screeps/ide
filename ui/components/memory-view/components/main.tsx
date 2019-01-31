import * as React from 'react';

import { default as MemoryItemView } from './item';

interface IMemoryMainViewProps {
    watches: any[];

    onClick?: Function;
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
                { this.props.watches.map((item, index) => {
                    // console.log(item);
                    return (<MemoryItemView key={ index } item={ item } onClick={ this.onClick }/>)
                })}
            </div>
        );
    }

    onClick = (data: any) => {
        this.props.onClick && this.props.onClick(data);
    }
}
