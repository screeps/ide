"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function changeTreeViewItemStatus(path, { modified }) {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    const treeView = treeViewPackage.mainModule.treeView;
    const entry = treeView.entryForPath(path);
    if (modified) {
        entry.classList.add('status-modified--screeps');
        // @ts-ignore
        console.log(entry.parentElement.parentElement);
        // @ts-ignore
        entry.parentElement.parentElement.classList.add('status-modified--screeps');
        return;
    }
    entry.classList.remove('status-modified--screeps');
}
exports.changeTreeViewItemStatus = changeTreeViewItemStatus;
//# sourceMappingURL=changeTreeViewItemStatus.js.map