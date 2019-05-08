import { ViewModel } from 'atom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const ACTION_CLOSE = 'ACTION_CLOSE';
export const SCREEPS_URI = 'atom://screeps-ide/screeps';

export class ScreepsPanel implements ViewModel {
    public element: HTMLElement;

    constructor(
        public state: {} = {}
    ) {
        this.element = document.createElement('div');
        this.render(this.state);
    }

    render({}) {
        ReactDOM.render(
            <div>
            </div>,
            this.element as HTMLElement
        )
    }

    destroy() {
    }

    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ModulesPane',
            state: this.state
        }
    }

    static deserialize({ state }: { state: {} }) {
        return new ScreepsPanel(state);
    }

    // Atom pane required interface's methods
    getURI() {
        return SCREEPS_URI;
    }

    getTitle() {
        return 'Screeps';
    }

    getDefaultLocation() {
        'left';
    }

    getAllowedLocations() {
        return ['left', 'right'];
    }
}
