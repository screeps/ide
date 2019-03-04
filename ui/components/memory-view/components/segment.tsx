import * as React from 'react';

interface IMemorySegmentViewProps {
    segment: string;

    onChange?: Function;
}

interface IMemorySegmentViewState {
    segment: string;
}

export default class MemorySegmentView extends React.Component<IMemorySegmentViewProps> {
    //@ts-ignore
    props: IMemorySegmentViewProps;

    state: IMemorySegmentViewState;

    constructor(props: IMemorySegmentViewProps) {
        super(props);

        this.state = {
            segment: props.segment
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.segment !== this.state.segment) {
            this.setState({ segment: nextProps.segment ? nextProps.segment : '' });
        }
    }

    public render() {
        return (
            <div className='screeps-memory__segment'>
                <textarea className='native-key-bindings' value={ this.state.segment } onChange={ this.onChange } placeholder='NO DATA'/>
            </div>
        );
    }

    onChange = (event: any) => {
        this.setState({
            segment: event.target.value
        });

        this.props.onChange && this.props.onChange(event.target.value);
    }
}
