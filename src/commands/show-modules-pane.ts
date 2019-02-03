import { getApi } from '../utils';

// import { Service } from '../service';
import { ModulesPane } from '../components/modules-pane';
import { TreeViewDir } from '../components/tree-view-dir';

export async function showModulesPaneCommand() {
    try {
        const api = await getApi();
        // const src = new Service();

        const modulesPane = new ModulesPane(api);
        new TreeViewDir(modulesPane);
    } catch(err) {
        //Noop.
    }
}
