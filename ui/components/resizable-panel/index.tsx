import * as React from 'react';

import { fromEvent } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

// import { default as MemorySegmentVeiw } from '../components/segment';

interface IResizablePanelProps {
    children?: any;
}

export default class ResizablePanel extends React.Component<IResizablePanelProps> {
    //@ts-ignore
    props: IResizablePanelProps;

    clientY: number = 0;
    elementRef = React.createRef<any>();

    constructor(props: IResizablePanelProps) {
        super(props);
    }

    public render() {
        return (
            <div ref={ this.elementRef } className='screeps-ide screeps-resizable-panel'>
                { this.props.children }
                <div className='panel-divider' onMouseDown={ this.onResizeStart }/>
            </div>
        );
    }

    onResizeStart = () => {
        const up$ = fromEvent(document.body, 'mouseup');
        const move$ = fromEvent(document.body, 'mousemove');

        move$.pipe(takeUntil(up$))
            // @ts-ignore
            .pipe(tap(({ movementY }) => {
                const element = this.elementRef.current;
                const height = parseInt(element.offsetHeight, 10);
        
                element.style.height = `${ height + movementY }px`;
            }))
            .subscribe();
    }

}
