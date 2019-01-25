"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const config_1 = require("../config");
// export function consumeElementIcons(addIconToElement: Function) {
function consumeElementIcons() {
    const srcDir = config_1.configGetter('src');
    const projectPath = atom.project.getPaths()[0];
    const fullPath = path.resolve(projectPath, srcDir);
    const elementRef = document.querySelector(`[data-path="${fullPath.replace(/["\\]/g, '\\$&')}"]`);
    if (elementRef) {
        elementRef.classList.add('icon-screeps');
    }
}
exports.consumeElementIcons = consumeElementIcons;
//# sourceMappingURL=consume-element-icons.js.map