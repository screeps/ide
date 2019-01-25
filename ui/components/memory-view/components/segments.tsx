import * as React from 'react';

interface IMemorySegmentsViewProps {
}

export default class MemorySegmentsView extends React.Component<IMemorySegmentsViewProps> {
    //@ts-ignore
    props: IMemorySegmentsViewProps;

    constructor(props: IMemorySegmentsViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className='screeps-memory__segments'>
                Segments
            </div>
        );
    }
}
