import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

import { fromEvent } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

// import { default as MemorySegmentVeiw } from '../components/segment';

interface IResizablePanelProps {
    height?: number;
    children?: any;

    onChangeHeight?(height: number): void;
}

export default function(props: IResizablePanelProps) {
    const [height, setHeight] = useState(props.height);
    const [style, setStyle] = useState({});

    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (height) {
            setStyle({
                ...style,
                'height': `${ height }px`
            });
        }
    }, [ height ])

    return (
        <div ref={ elementRef } className='screeps-ide screeps-resizable-panel' style={ style }>
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

                const height = element.offsetHeight + movementY;

                setHeight(height);

                props.onChangeHeight && props.onChangeHeight(height);
            }))
            .subscribe();
    }

}
