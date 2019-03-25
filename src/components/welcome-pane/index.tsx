import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { configSetter, configGetter } from '../../config';
import { WelcomeView } from '../../../ui';

export const WELCOME_URI = 'atom://screeps-ide/welcome';

export class WelcomePane {
    public element: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.render();
    }

    render() {
        ReactDOM.render(
            <WelcomeView
                showOnStartup={ configGetter('showOnStartup') as boolean }

                onChangeShowOnStartup={(...args) => this.onChangeShowOnStartup(...args)}
            />,
            this.element
        );
    }

    onChangeShowOnStartup(value: boolean) {
        configSetter('showOnStartup', value);
    }

    // Atom pane required interface's methods
    getURI() {
        return WELCOME_URI;
    }

    getTitle() {
        return 'Welcome to Screeps';
    }
}
