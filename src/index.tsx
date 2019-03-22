import { CompositeDisposable } from 'atom';

import { PACKAGE_NAME, configGetter } from './config';

import {
    authCommand,
    startCommand,
    // showConsolePanelCommand,
    // showMemoryPanelCommand,
    // showModulesPaneCommand
} from './commands';
import { WelcomePane } from './components/welcome-pane';
import { ModulesPane, MODULES_URI } from './components/modules-pane';
// import { ModulesPane, MODULES_URI } from './components/modules-pane';

const subscriptions = new CompositeDisposable();

export { default as config } from './config';
export * from './consumed-services';

export function initialize(state: any) {
    console.log('Screeps-IDE:initialize', state);
}

export function activate(state: any) {
    console.log('Screeps-IDE:activate', state);

    subscriptions.add(atom.workspace.addOpener((uri): any => {
        if (uri === MODULES_URI) {
            return new ModulesPane();
        }
    }));

    //@ts-ignore
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${ PACKAGE_NAME }:${ authCommand.name }`]: authCommand,
        [`${ PACKAGE_NAME }:${ startCommand.name }`]: startCommand
    }));

    if (configGetter('showOnStartup')) {
        setTimeout(() => new WelcomePane(), 500);
    }
}

export function deactivate() {
    subscriptions.dispose();
}

export function serialize() {
    return { };
}

// @ts-ignore
export function deserializeModulesPane({ state }) {
    return ModulesPane.deserialize({ state });
}

export function handleURI(parsedUri: any) {
    console.log(parsedUri)
}
