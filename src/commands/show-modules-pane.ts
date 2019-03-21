import { getApi, getUser } from '../utils';

import { ModulesPane } from '../components/modules-pane';

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

        new ModulesPane(api);

    } catch(err) {
        //Noop.
    }
}
