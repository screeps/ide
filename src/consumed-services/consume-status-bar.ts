import { CompositeDisposable } from 'atom';

import { MODULES_URI } from '../components/modules-pane';
import {
    // ConsolePanel,
    CONSOLE_URI
} from '../components/console-panel';
import {
    MEMORY_URI
} from '../components/memory-panel';

import {
    // showConsolePanelCommand,
    // showMemoryPanelCommand,
    // showModulesPaneCommand
} from '../commands';

// const PACKAGE_NAME = 'screeps-ide';

export function consumeStatusBar(statusBar: any) {
    const subscriptions = new CompositeDisposable()

    const consoleElementRef = document.createElement('div');
    consoleElementRef.classList.add('screeps-ide__status-bar', 'inline-block', 'sc-icon-screeps');
    consoleElementRef.addEventListener('click', () => atom.workspace.open(CONSOLE_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    }));

    statusBar.addLeftTile({
        item: consoleElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(consoleElementRef, { title: 'Show Console '}));

    const modulesElementRef = document.createElement('div');
    modulesElementRef.innerText = 'Modules';
    modulesElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    modulesElementRef.addEventListener('click', () => atom.workspace.open(MODULES_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'left'
    }));

    statusBar.addLeftTile({
        item: modulesElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(modulesElementRef, { title: 'Show Modules '}));

    const memoryElementRef = document.createElement('div');
    memoryElementRef.innerText = 'Memory';
    memoryElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    // memoryElementRef.addEventListener('click', () => showMemoryPanelCommand());
    memoryElementRef.addEventListener('click', () => atom.workspace.open(MEMORY_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    }));

    statusBar.addLeftTile({
        item: memoryElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(memoryElementRef, { title: 'Show Memory '}));
}
