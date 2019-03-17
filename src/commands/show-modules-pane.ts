import { tap, filter } from 'rxjs/operators';

import { getApi, getUser } from '../utils';

import { ModulesPane, ACTION_CLOSE } from '../components/modules-pane';
import { TreeViewDir } from '../components/tree-view-dir';

export async function showModulesPaneCommand() {
    try {
        const pane = atom.workspace.getPaneItems().find((pane) => {
            return pane instanceof ModulesPane;
        });

        if (pane) {
            return;
        }

        const api = await getApi();
        await getUser();

        const modulesPane = new ModulesPane(api);
        const treeViewRef = new TreeViewDir(modulesPane);

        modulesPane.events$
            .pipe(filter(({ type }) => type === ACTION_CLOSE))
            .pipe(tap(() => {
                treeViewRef.destroy();
            }))
            .subscribe();

    } catch(err) {
        //Noop.
    }
}
