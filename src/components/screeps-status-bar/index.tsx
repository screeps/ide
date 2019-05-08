import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BehaviorSubject } from 'rxjs';

export class ScreepsStatusBar {
    public element: HTMLElement = document.createElement('div');

    constructor(
        private _state: BehaviorSubject<IState>
    ) {
        this.element.classList.add(
            'screeps-ide__status-bar',
            'screeps-ide__status-bar--screeps',
            'inline-block'
        );

        this.render(this._state.getValue());
    }

    render({ branch }: IState) {
        ReactDOM.render(
            <div>
                <b className='sc-icon-screeps'></b>
                <i>{ branch }</i>
            </div>,
            this.element
        )
    }
}
