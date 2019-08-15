import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { authCommand } from '../../commands';
import { configSetter, configGetter } from '../../config';
import { WelcomeView } from '../../../ui';

import { default as store } from '../../store';
import { CreateProjectAction } from '../../store/actions';

import { SCREEPS_URI } from '../screeps-panel';

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

                onSignin={ () => this.onSignin() }
                onCreateNewProject={ () => this.onCreateNewProject() }
                onChangeShowOnStartup={(...args) => this.onChangeShowOnStartup(...args)}
            />,
            this.element
        );
    }

    async onSignin() {
        try {
            await authCommand();

            atom.workspace.open(SCREEPS_URI, {
                activatePane: true,
                activateItem: true,
                // split: 'down',
                location: 'bottom'
            });
        } catch(err) {
            // Noop.
        }
    }

    async onCreateNewProject() {
        store.dispatch(CreateProjectAction());
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
