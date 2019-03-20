"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
async function readUserCode(fullPath) {
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
exports.readUserCode = readUserCode;
//# sourceMappingURL=commit.js.map