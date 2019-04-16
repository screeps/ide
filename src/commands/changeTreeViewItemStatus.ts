export function changeTreeViewItemStatus(path: string, { modified }: IModule) {
    const treeViewPackage = atom.packages.getActivePackage('tree-view');
    // @ts-ignore
    const treeView = treeViewPackage.mainModule.treeView;

    const entry = treeView.entryForPath(path) as HTMLElement;

    if (modified) {
        entry.classList.add('status-modified--screeps');

        // @ts-ignore
        console.log(entry);
        // @ts-ignore
        entry.parentElement.parentElement.classList.add('status-modified--screeps');
        return;
    }

    entry.classList.remove('status-modified--screeps');
}
