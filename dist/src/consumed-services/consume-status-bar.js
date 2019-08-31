"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const screeps_panel_1 = require("../components/screeps-panel");
const screeps_status_bar_1 = require("../components/screeps-status-bar");
const priority = 10000;
function consumeStatusBar(statusBar) {
    const subscriptions = new atom_1.CompositeDisposable();
    const consoleStatusBar = new screeps_status_bar_1.ScreepsStatusBar();
    statusBar.addLeftTile({ item: consoleStatusBar.element, priority });
    consoleStatusBar.element.addEventListener('click', () => atom.workspace.open(screeps_panel_1.SCREEPS_URI, {
        activatePane: true,
        activateItem: true,
        // split: 'down',
        location: 'left'
    }));
    statusBar.addLeftTile({
        item: consoleStatusBar.element,
        priority
    });
    subscriptions.add(atom.tooltips.add(consoleStatusBar.element, { title: 'Show Screeps panel' }));
}
exports.consumeStatusBar = consumeStatusBar;
//# sourceMappingURL=consume-status-bar.js.map