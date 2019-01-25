/// <reference path='./index.d.ts' />

import * as React from 'react';
import { Subscription } from 'rxjs';

import { default as MemoryControlsView } from './components/controls';
import { default as MemoryMainView } from './components/main';
import { default as MemorySegmentsView } from './components/segments';

export default class MemoryView extends React.Component<IMemoryViewProps> {
    //@ts-ignore
    props: IMemoryViewProps;

    state: IMemoryViewState;

    _shards$: Subscription | null = null;

    constructor(props: IMemoryViewProps) {
        super(props);

        this.state = {
            shards: [],
            view: 'main'
        };
    }

    componentDidMount() {
        this._shards$ = this.props.shards.subscribe((shards: any) => {
            this.setState({
                ...this.state,
                shards
            });
        });
    }

    onClose = () => {
        this.props.onClose && this.props.onClose();
    }

    onResizeStart = (event: any) => {
        this.props.onResizeStart && this.props.onResizeStart(event);
    }

    onToggleView = ({ view }: { view: string }) => {
        console.log(view);
        this.setState({
            ...this.state,
            view
        })
    }

    public render() {
        let view;

        if (this.state.view === 'main') {
            view = (<MemoryMainView watches={ this.props.watches }/>);
        }

        if (this.state.view === 'segments') {
            view = (<MemorySegmentsView />);
        }

        return (
            <div className='screeps-ide screeps-memory screeps-memory__view'>
                <div className='panel-divider' onMouseDown={ this.onResizeStart } />
                <MemoryControlsView
                    shards={ this.state.shards }

                    onClose={ this.onClose }
                    onToggleView={ this.onToggleView }
                />
                <hr className='screeps-hr' />
                { view }
            </div>
        );
    }
}
