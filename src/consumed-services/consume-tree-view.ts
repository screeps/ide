const path = require('path');

import { configGetter } from '../config';

export function consumeTreeView(treeView: any) {
    const projectPath = atom.project.getPaths()[0];

    if (!projectPath) {
        return;
    }

    const srcDir = configGetter('src');
    const fullPath = path.resolve(projectPath, srcDir);

    const entry = treeView.entryForPath(fullPath) as HTMLElement;
    entry.setAttribute('screeps-dist', 'screeps-dist');
}
