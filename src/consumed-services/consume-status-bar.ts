import { CompositeDisposable } from 'atom';

import { default as __state } from '../state';

import { SCREEPS_URI } from '../components/screeps-panel';

import { ScreepsStatusBar } from '../components/screeps-status-bar';

const priority = 10000;

export function consumeStatusBar(statusBar: any) {
    const subscriptions = new CompositeDisposable();

    const consoleStatusBar = new ScreepsStatusBar();

    statusBar.addLeftTile({ item: consoleStatusBar.element, priority });
    consoleStatusBar.element.addEventListener('click', () => atom.workspace.open(SCREEPS_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'left'
    }));

    statusBar.addLeftTile({
        item: consoleStatusBar.element,
        priority
    });
    subscriptions.add(atom.tooltips.add(consoleStatusBar.element, { title: 'Show Screeps panel'}));
}
