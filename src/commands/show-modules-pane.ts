import { tap, filter } from 'rxjs/operators';

import { getApi, getUser } from '../utils';

import { ModulesPane, ACTION_CLOSE } from '../components/modules-pane';
import { TreeViewDir } from '../components/tree-view-dir';



export async function showModulesPaneCommand() {
    try {
        // TODO: need to fix connection to right set token
        const api = await getApi();
        // const user = 
        await getUser();
        // const socket = getSocket();

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
