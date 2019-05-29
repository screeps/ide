import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class ScreepsStatusBar {
    public element: HTMLElement = document.createElement('div');

    constructor(
    ) {
        this.element.classList.add(
            'screeps-ide__status-bar',
            'screeps-ide__status-bar--screeps',
            'inline-block'
        );

        this.render();
    }

    render() {
        ReactDOM.render(
            <div>
                <b className='sc-icon-screeps'></b>
                <i>Screeps</i>
            </div>,
            this.element
        )
    }
}
