import * as React from 'react';

interface IMemoryMainViewProps {
    watches: any[]
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
                { this.props.watches.map(() => {
                    return (<div></div>)
                })}
            </div>
        );
    }
}
