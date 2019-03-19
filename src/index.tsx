import { CompositeDisposable } from 'atom';

import { PACKAGE_NAME, configGetter } from './config';

import {
    authCommand,
    startCommand,
    commitCommand
} from './commands';
import { WelcomePane } from './components/welcome-pane';

const subscriptions = new CompositeDisposable();

export { default as config } from './config';
export * from './consumed-services';

export function initialize(state: any) {
    console.log('Screeps-IDE:initialize', state);
}

export function activate(state: any) {
    console.log('Screeps-IDE:activate', state);

    //@ts-ignore
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${ PACKAGE_NAME }:${ authCommand.name }`]: authCommand,
        [`${ PACKAGE_NAME }:${ startCommand.name }`]: startCommand,
        [`${ PACKAGE_NAME }:${ commitCommand.name }`]: commitCommand
    }));

    if (configGetter('showOnStartup')) {
        setTimeout(() => new WelcomePane(), 500);
    }
}

export function deactivate() {
    subscriptions.dispose();
}

export function serialize() {
    return {
    };
}

export function handleURI(parsedUri: any) {
    console.log(parsedUri)
}
