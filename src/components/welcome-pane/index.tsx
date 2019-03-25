import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { WelcomeView } from '../../../ui';

export const WELCOME_URI = 'atom://screeps-ide/welcome';

export class WelcomePane {
    public element: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.render();
    }

    render() {
        ReactDOM.render(<WelcomeView />, this.element);
    }

    // Atom pane required interface's methods
    getURI() {
        return WELCOME_URI;
    }

    getTitle() {
        return 'Welcome to Screeps';
    }
}
