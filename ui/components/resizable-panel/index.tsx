import * as React from 'react';

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
                <div className='panel-divider' onMouseDown={ this.onResizeStart }/>
                { this.props.children }
            </div>
        );
    }

    onResizeStart = (event: any) => {
        this.clientY = event.clientY;

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.onResizeStop);
    }

    onResize = (event: any) => {
        if (!this.elementRef.current) {
            return;
        }

        const parent = this.elementRef.current.parentElement;

        const offsetY = event.clientY - this.clientY;
        this.clientY = event.clientY;

        const height = parseInt(parent.style.height, 10);

        parent.style.height = `${ height - offsetY }px`
    }

    onResizeStop = () => {
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeStop);
    }

}
