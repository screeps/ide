import { getApi } from '../utils';

import { Service } from '../service';
import { ModulesPane } from '../components/modules-pane';
import { TreeViewDir } from '../components/tree-view-dir';

export async function showModulesPaneCommand() {
    try {
        await getApi();

        const src = new Service();

        new ModulesPane(src);
        new TreeViewDir(src);
    } catch(err) {
        //Noop.
    }
}
