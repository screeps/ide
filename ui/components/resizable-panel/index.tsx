import * as React from 'react';
import { useRef } from 'react';

import { fromEvent } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

// import { default as MemorySegmentVeiw } from '../components/segment';

interface IResizablePanelProps {
    children?: any;
}

export default function(props: IResizablePanelProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={ elementRef } className='screeps-ide screeps-resizable-panel'>
            { props.children }
            <div className='panel-divider' onMouseDown={ onResizeStart }/>
        </div>
    );

    function onResizeStart() {
        const up$ = fromEvent(document.body, 'mouseup');
        const move$ = fromEvent(document.body, 'mousemove');

        move$.pipe(takeUntil(up$))
            // @ts-ignore
            .pipe(tap(({ movementY }) => {
                const element = elementRef.current;

                if (!element) {
                    return;
                }

                element.style.height = `${ element.offsetHeight + movementY }px`;
            }))
            .subscribe();
    }

}
