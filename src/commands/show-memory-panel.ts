// import { tap, filter } from 'rxjs/operators';

// import { getSocket, getApi, getUser } from '../utils';

// import { Service } from '../service';
// import { MemoryPanel, ACTION_CLOSE } from '../components/memory-panel';

// let memoryPanel: MemoryPanel | null;

export async function showMemoryPanelCommand() {
    // try {
    //     if (memoryPanel && memoryPanel.isVisible) {
    //         return;
    //     }

    //     atom.workspace.getBottomPanels().forEach((panel) => {
    //         panel.hide();
    //     });

    //     if (memoryPanel && !memoryPanel.isVisible) {
    //         memoryPanel.show();
    //         return;
    //     }

    //     const api = await getApi();
    //     const user = await getUser();
    //     const socket = getSocket();

    //     memoryPanel = new MemoryPanel(user, api, socket, new Service());

    //     memoryPanel.events$
    //         .pipe(filter(({ type }) => type === ACTION_CLOSE))
    //         .pipe(tap(() => {
    //             memoryPanel = null;
    //         }))
    //         .subscribe();
    // } catch(err) {
    //     // Ignore.
    // }
}
