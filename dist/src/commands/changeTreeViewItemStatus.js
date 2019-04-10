"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function changeTreeViewItemStatus(path, { modified }) {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    const treeView = treeViewPackage.mainModule.treeView;
    const entry = treeView.entryForPath(path);
    if (!modified) {
        entry.classList.remove('status-modified');
        return;
    }
    entry.classList.add('status-modified');
}
exports.changeTreeViewItemStatus = changeTreeViewItemStatus;
//# sourceMappingURL=changeTreeViewItemStatus.js.map