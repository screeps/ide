/// <reference path='./index.d.ts' />

// @ts-ignore
import * as packageDeps from 'atom-package-deps';

import { CompositeDisposable, TextEditor } from 'atom';

import { default as store } from './store';
import {
    AddTextEditorAction,
    LocalFileChangeAction
} from './store/actions';
import './store/reducers';
import * as effects from './store/effects';

import { default as __state, INITIAL_STATE } from './state';
import { PACKAGE_NAME, configGetter } from './config';

import {
    fetch,
    commit,
    changeProjectBranch
} from './commands';
import { WelcomePane, WELCOME_URI } from './components/welcome-pane';
import { ConsolePanel, CONSOLE_URI } from './components/console-panel';
import { MemoryPanel, MEMORY_URI } from './components/memory-panel';
import { ScreepsPanel, SCREEPS_URI, IScreepsPanelState } from './components/screeps-panel';

import { OpenTextEditorAction } from './components/modules-block/actions';

const subscriptions = new CompositeDisposable();

export { default as config } from './config';
export * from './consumed-services';

export function initialize(state: IState) {
    // @ts-ignore
    atom.screeps = {
        state: __state
    };

    if (!state) {
        state = INITIAL_STATE;
    }

    if (!state.modules) {
        state.modules = {}
    }

    __state.next(state);

    Object.values(effects).forEach((effect) => effect.subscribe());
}

export function activate(state: IState) {
    console.log('Screeps-IDE:activate', state);

    packageDeps.install('screeps-ide');

    function textEditorDidChange(textEditor: TextEditor) {
        const path = textEditor.getPath();
        store.dispatch(AddTextEditorAction(path))

        return function() {
            if (!path) {
                return;
            }

            const content = textEditor.getText();

            store.dispatch(LocalFileChangeAction(path, content));
        }
    }

    atom.workspace.getTextEditors()
        .forEach((textEditor) => {
            textEditor.onDidChange(textEditorDidChange(textEditor));

            const path = textEditor.getPath() as string;
            const matches = /[\\\/]\.branches[\\\/]([^\\]+)[\\\/]([^\\]+)\.js/.exec(path);

            if (!matches) {
                return;
            }

            const [, branch, module] = matches;
            store.dispatch(OpenTextEditorAction(branch, module));
        });

    atom.workspace.getCenter().onDidAddTextEditor(({ textEditor }) => {
        textEditor.onDidChange(textEditorDidChange(textEditor));
    });

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
        [`${ PACKAGE_NAME }:${ fetch.name }`]: fetch,
        [`${ PACKAGE_NAME }:${ changeProjectBranch.name }`]: changeProjectBranch,
        [`${ PACKAGE_NAME }:branches`]: () => openUri(SCREEPS_URI),
        [`${ PACKAGE_NAME }:console`]: () => openUri(CONSOLE_URI),
        [`${ PACKAGE_NAME }:memory`]: () => openUri(MEMORY_URI)
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

export function deserializeScreepsPanel({ state }: { state: IScreepsPanelState }) {
    return ScreepsPanel.deserialize({ state });
}

export function handleURI(parsedUri: any) {
    console.log(parsedUri)
}

function openUri(uri: string) {
    atom.workspace.open(uri, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    });
}
