import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MemoryView } from '../../../ui';

import { Panel } from 'atom';

import { Service } from '../../service';

let clientY: number;

export class MemoryPane {
    public element: HTMLElement;
    private _panel: Panel;

    constructor(
        private _service: Service
    ) {
        this.element = document.createElement('div');
        this.element.style.height = '300px';

        this.render({});

        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }

    onClose = () => {
        this._panel.destroy();
    }

    onResizeStart = (event: any) => {
        clientY = event.clientY;

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.onResizeStop);
    }

    onResize = (event: any) => {
        const offsetY = event.clientY - clientY;
        clientY = event.clientY;

        //@ts-ignore
        const height = parseInt(this.element.style.height, 10);

        this.element.style.height = `${ height - offsetY }px`
    }

    onResizeStop = () => {
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeStop);
    }

    render({ }) {
        ReactDOM.render(
            <MemoryView
                shards={ this._service.shards$ }
                watches={ [] }

                onClose={ this.onClose }
                onResizeStart={ this.onResizeStart }
            />,
            this.element as HTMLElement
        )
    }

    getURI() {
        return 'atom://screeps-ide-memory-view';
    }
    
    getTitle() {
        return '';
    }
    
    isPermanentDockItem() {
        return true;
    }
    
    getAllowedLocations() {
        return ['top'];
    }
}