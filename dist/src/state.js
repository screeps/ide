"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
exports.INITIAL_STATE = {
    branch: '',
    branches: [],
    modules: {
        default: {}
    },
    projects: {},
    files: {}
};
const __state = new rxjs_1.BehaviorSubject(exports.INITIAL_STATE);
const next = __state.next;
__state.next = function (...args) {
    // console.log(.1, 'next', ...args);
    return next.apply(this, args);
};
exports.default = __state;
function selectModules(branch) {
    const { modules } = __state.getValue();
    return Object.entries(modules[branch])
        .reduce((modules, [module, { content, deleted, isNew }]) => {
        if (!deleted && !isNew) {
            modules[module] = content;
        }
        return modules;
    }, {});
}
exports.selectModules = selectModules;
function selectProjectPath(filePath) {
    const { projects } = __state.getValue();
    if (!projects) {
        return;
    }
    const projectPath = Object.keys(projects).find((projectPath) => {
        return filePath.includes(projectPath);
    });
    return projectPath;
}
exports.selectProjectPath = selectProjectPath;
//# sourceMappingURL=state.js.map