import { CompositeDisposable } from 'atom';

import { PACKAGE_NAME, configGetter } from './config';

import {
    authCommand,
    startCommand,
    // showConsolePanelCommand,
    // showMemoryPanelCommand,
    // showModulesPaneCommand
} from './commands';
import { WelcomePane, WELCOME_URI } from './components/welcome-pane';
import { ModulesPane, MODULES_URI } from './components/modules-pane';
import { ConsolePanel, CONSOLE_URI } from './components/console-panel';
import { MemoryPanel, MEMORY_URI } from './components/memory-panel';

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

    subscriptions.add(atom.workspace.addOpener((uri): any => {
        if (uri === CONSOLE_URI) {
            return new ConsolePanel();
        }
    }));

    subscriptions.add(atom.workspace.addOpener((uri): any => {
        if (uri === MEMORY_URI) {
            return new MemoryPanel();
        }
    }));

    subscriptions.add(atom.workspace.addOpener((uri): any => {
        if (uri === WELCOME_URI) {
            return new WelcomePane();
        }
    }));

    //@ts-ignore
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${ PACKAGE_NAME }:${ authCommand.name }`]: authCommand,
        [`${ PACKAGE_NAME }:${ startCommand.name }`]: startCommand
    }));

    if (configGetter('showOnStartup')) {
        setTimeout(() => atom.workspace.open(WELCOME_URI, {
            activateItem: true,
            split: 'left'
        }), 500);
    }
}

export function deactivate() {
    subscriptions.dispose();
}

export function serialize() {
    return { };
}

export function deserializeModulesPane({ state }: { state: any }) {
    return ModulesPane.deserialize({ state });
}

export function deserializeConsolePanel({ state }: { state: any }) {
    return ConsolePanel.deserialize({ state });
}

export function deserializeMemoryPanel({ state }: { state: any }) {
    return MemoryPanel.deserialize({ state });
}

export function handleURI(parsedUri: any) {
    console.log(parsedUri)
}
