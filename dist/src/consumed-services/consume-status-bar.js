"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const modules_pane_1 = require("../components/modules-pane");
const console_panel_1 = require("../components/console-panel");
const memory_panel_1 = require("../components/memory-panel");
// const PACKAGE_NAME = 'screeps-ide';
function consumeStatusBar(statusBar) {
    const subscriptions = new atom_1.CompositeDisposable();
    const consoleElementRef = document.createElement('div');
    consoleElementRef.classList.add('screeps-ide__status-bar', 'inline-block', 'sc-icon-screeps');
    consoleElementRef.addEventListener('click', () => atom.workspace.open(console_panel_1.CONSOLE_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    }));
    statusBar.addLeftTile({
        item: consoleElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(consoleElementRef, { title: 'Show Console ' }));
    const modulesElementRef = document.createElement('div');
    modulesElementRef.innerText = 'Modules';
    modulesElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    modulesElementRef.addEventListener('click', () => atom.workspace.open(modules_pane_1.MODULES_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'left'
    }));
    statusBar.addLeftTile({
        item: modulesElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(modulesElementRef, { title: 'Show Modules ' }));
    const memoryElementRef = document.createElement('div');
    memoryElementRef.innerText = 'Memory';
    memoryElementRef.classList.add('screeps-ide__status-bar', 'inline-block');
    // memoryElementRef.addEventListener('click', () => showMemoryPanelCommand());
    memoryElementRef.addEventListener('click', () => atom.workspace.open(memory_panel_1.MEMORY_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'bottom'
    }));
    statusBar.addLeftTile({
        item: memoryElementRef,
        priority: 10000
    });
    subscriptions.add(atom.tooltips.add(memoryElementRef, { title: 'Show Memory ' }));
}
exports.consumeStatusBar = consumeStatusBar;
//# sourceMappingURL=consume-status-bar.js.map