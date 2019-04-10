export function changeTreeViewItemStatus(path: string, { modified }: IModule) {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    const treeView = treeViewPackage.mainModule.treeView;

    const entry = treeView.entryForPath(path) as HTMLElement;

    if (!modified) {
        entry.classList.remove('status-modified');
        return;
    }

    entry.classList.add('status-modified');
}
