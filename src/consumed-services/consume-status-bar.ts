import { CompositeDisposable } from 'atom';

import { tap } from 'rxjs/operators';

import { default as __state } from '../state';

import { MODULES_URI } from '../components/modules-pane';
import { CONSOLE_URI } from '../components/console-panel';
import { MEMORY_URI } from '../components/memory-panel';

import { ScreepsStatusBar } from '../components/screeps-status-bar';

const priority = 10000;

export function consumeStatusBar(statusBar: any) {
    const subscriptions = new CompositeDisposable();


    const consoleStatusBar = new ScreepsStatusBar(__state);
    // Rerender compoment if branch changes in ModulesView 
    __state.pipe(tap((state: IState) => consoleStatusBar.render(state)))
        .subscribe();
    statusBar.addLeftTile({ item: consoleStatusBar.element, priority });


    const consoleElementRef = document.createElement('div');
    consoleElementRef.innerText = 'Console';
    consoleElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    consoleElementRef.addEventListener('click', () => atom.workspace.open(CONSOLE_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    }));

    statusBar.addLeftTile({
        item: consoleElementRef,
        priority
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
        priority
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
        priority
    });
    subscriptions.add(atom.tooltips.add(memoryElementRef, { title: 'Show Memory '}));
}
