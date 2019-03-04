import * as React from 'react';

export interface IMemorySegmentControlsViewProps {
    segment: string;
    hasChange: boolean;

    onSegment: Function;
    onRefresh: Function;
    onUpdate: Function;
}

export interface IMemorySegmentControlsViewState {
    segment: string;
    hasChange: boolean;
}

const segments: number[] = [];
for (let i = 0; i < 100; i++) {
    segments.push(i);
}

export default class MemorySegmentControlsView extends React.Component<IMemorySegmentControlsViewProps> {
    // @ts-ignore
    props: IMemorySegmentControlsViewProps;

    state: IMemorySegmentControlsViewState;

    constructor(props: any) {
        super(props);

        this.state = {
            segment: props.segment,
            hasChange: props.hasChange
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            ...this.state,
            hasChange: nextProps.hasChange
        });
    }

    public render() {
        return (
            <div className='screeps-memory__segment-controls'>
                Segment #:
                <select className='btn' onChange={ this.onSegment } value={ this.state.segment }>
                    { segments.map((name) => {
                        return (<option key={ name } value={ name }>{ name }</option>);
                    })}
                </select>
                <button type='button' className='btn' onClick={ this.onRefresh }>
                    <i className='sc-icon-cached' />
                </button>
                <button type='button' className='btn' onClick={ this.onUpdate } disabled={ !this.state.hasChange }>
                    <i className='sc-icon-done' />
                </button>
            </div>
        );
    }

    onSegment = (event: any) => {
        this.setState({
            ...this.state,
            segment: event.target.value
        });

        this.props.onSegment && this.props.onSegment(event.target.value);
    }

    onRefresh = () => {
        this.props.onSegment && this.props.onSegment(this.state.segment);
    }

    onUpdate = (event: any) => {
        this.props.onUpdate && this.props.onUpdate(event.target.value);
    }
}
