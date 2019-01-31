"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const atom_1 = require("atom");
const utils_1 = require("../utils");
const config_1 = require("../config");
async function commitCommand(branch) {
    const api = await utils_1.getApi();
    let srcDir = config_1.configGetter('src');
    const modules = await readUserCode(srcDir);
    return api.updateUserCode({ branch, modules });
}
exports.commitCommand = commitCommand;
async function readUserCode(srcDir) {
    const projectPath = atom.project.getPaths()[0];
    const fullPath = path.resolve(projectPath, srcDir);
    const dir = new atom_1.Directory(fullPath);
    const entries = dir.getEntriesSync();
    const files = entries.filter((entry) => {
        return entry.isFile();
    });
    const modules = {};
    for (let file of files) {
        const content = await file.read(true);
        const fileName = file.getBaseName()
            .replace('.js', '');
        modules[fileName] = content;
    }
    return modules;
}
// (function() {
//   return 1;
//
//   if (!/mycode/.test(atom.project.getPaths()[0])) {
//     return 0;
//   }
//
//   atom.project.onDidChangeFiles(async (events) => {
//     console.log(1, events);
//
//     for (const { action } of events) { // action, path
//       if (action === 'modified') {
//         changeFilesSbj.next({ type: action });
//       }
//     }
//   });
//
//   changeFiles$
//     .pipe(filter(({ type }) => type === 'modified'))
//     .pipe(switchMap(readCode))
//     .pipe(map((modules) => ({ branch: 'default', modules })))
//     .pipe(tap((data) => api.updateUserCode(data)))
//     .subscribe();
// })();
//# sourceMappingURL=commit.js.map