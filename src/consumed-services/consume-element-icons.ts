const path = require('path');

import { configGetter } from '../config';

// export function consumeElementIcons(addIconToElement: Function) {
export function consumeElementIcons() {
    const srcDir = configGetter('src');

    const projectPath = atom.project.getPaths()[0];
    const fullPath = path.resolve(projectPath, srcDir);

    const elementRef: HTMLElement | null = document.querySelector(`[data-path="${ fullPath.replace(/["\\]/g, '\\$&')}"]`);

    if (elementRef) {
        elementRef.classList.add('icon-screeps');
    }
}
