import { MemoryPane } from '../components/memory-pane';

import { Service } from '../service';

export async function showMemoryPaneCommand() {
    new MemoryPane(new Service());
}
