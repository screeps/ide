"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../store");
const utils_1 = require("../utils");
async function changeProjectBranch(event) {
    let target = event.target;
    const el = utils_1.$('span:first-child', target);
    if (!el) {
        return;
    }
    const projectPath = el.getAttribute('data-path');
    store_1.default.dispatch({
        type: 'CREATE_PROJECT',
        payload: {
            projectPath,
            projectPathLabel: 'Project folder path',
            projectPathReadonly: true,
            download: true,
            downloadForce: true,
            submitBtn: 'Change'
        }
    });
}
exports.changeProjectBranch = changeProjectBranch;
//# sourceMappingURL=change-project-branch.js.map