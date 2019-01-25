import { CompositeDisposable } from 'atom';

import { ModulesPane } from './components/modules-pane';
import { TreeViewDir } from './components/tree-view-dir';

import { PACKAGE_NAME } from './config';

import {
    authCommand,
    startCommand,
    commitCommand
} from './commands';

import {
    Service
} from './service';

const subscriptions = new CompositeDisposable();

export { default as config } from './config';
export * from './consumed-services';

export function initialize(state: any) {
    console.log('Screeps-IDE:initialize', state);
}

export function activate(state: any) {
    console.log('Screeps-IDE:activate', state);

    const _service = new Service();
    _service.getUserCode();

    new TreeViewDir(_service);
    new ModulesPane(_service);

    //@ts-ignore
    subscriptions.add(atom.commands.add('atom-workspace', {
        [`${ PACKAGE_NAME }:${ authCommand.name }`]: authCommand,
        [`${ PACKAGE_NAME }:${ startCommand.name }`]: startCommand,
        [`${ PACKAGE_NAME }:${ commitCommand.name }`]: commitCommand
    }));

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
