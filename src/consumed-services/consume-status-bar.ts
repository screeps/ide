import { CompositeDisposable } from 'atom';

import {
    showConsolePaneCommand,
    showMemoryPaneCommand
} from '../commands';

// const PACKAGE_NAME = 'screeps-ide';

export function consumeStatusBar(statusBar: any) {
    const subscriptions = new CompositeDisposable()

    const consoleElementRef = document.createElement('div');
    consoleElementRef.classList.add('screeps-ide__status-bar', 'inline-block', 'sc-icon-screeps');
    consoleElementRef.addEventListener('click', () => showConsolePaneCommand());

    statusBar.addLeftTile({
        item: consoleElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(consoleElementRef, { title: 'Show Console '}));

    const memoryElementRef = document.createElement('div');
    memoryElementRef.innerText = 'Memory';
    memoryElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    memoryElementRef.addEventListener('click', () => showMemoryPaneCommand());

    statusBar.addLeftTile({
        item: memoryElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(memoryElementRef, { title: 'Show Memory '}));
}
