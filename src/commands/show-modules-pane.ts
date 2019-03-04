import { getApi, getUser } from '../utils';

// import { Service } from '../service';
import { ModulesPane } from '../components/modules-pane';
import { TreeViewDir } from '../components/tree-view-dir';

export async function showModulesPaneCommand() {
    try {
        // TODO: need to fix connection to right set token
        const api = await getApi();
        // const user = 
        await getUser();
        // const socket = getSocket();

        const modulesPane = new ModulesPane(api);
        new TreeViewDir(modulesPane);
    } catch(err) {
        //Noop.
    }
}
