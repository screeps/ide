/// <reference path='./index.d.ts' />

import { CompositeDisposable } from 'atom';

import { default as __state } from './state';
import { PACKAGE_NAME, configGetter } from './config';

import {
    commit,
    commitAll,
    revert,
    revertAll,
    onDidChangeFiles
} from './commands';
import { WelcomePane, WELCOME_URI } from './components/welcome-pane';
import { ConsolePanel, CONSOLE_URI } from './components/console-panel';
import { MemoryPanel, MEMORY_URI } from './components/memory-panel';
import { ScreepsPanel, SCREEPS_URI } from './components/screeps-panel';

const subscriptions = new CompositeDisposable();

export { default as config } from './config';
export * from './consumed-services';

export function initialize(state: IState) {
    if (!state) {
        state = {
            branch: 'default',
            modules: {}
        }
    }

    if (!state.modules) {
        state.modules = {}
    }

    __state.next(state);

    atom.project.onDidChangeFiles(onDidChangeFiles);
}

export function activate(state: IState) {
    console.log('Screeps-IDE:activate', state);

    subscriptions.add(atom.workspace.addOpener((uri): any => {
        if (uri === SCREEPS_URI) {
            return new ScreepsPanel();
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

    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${ PACKAGE_NAME }:${ commit.name }`]: commit,
        [`${ PACKAGE_NAME }:${ commitAll.name }`]: commitAll,
        [`${ PACKAGE_NAME }:${ revert.name }`]: revert,
        [`${ PACKAGE_NAME }:${ revertAll.name }`]: revertAll
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
    // return {};
    return __state.getValue();
}

export function deserializeConsolePanel({ state }: { state: any }) {
    return ConsolePanel.deserialize({ state });
}

export function deserializeMemoryPanel({ state }: { state: any }) {
    return MemoryPanel.deserialize({ state });
}

export function deserializeScreepsPanel({ state }: { state: any }) {
    return ScreepsPanel.deserialize({ state });
}

export function handleURI(parsedUri: any) {
    console.log(parsedUri)
}
