"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const on_did_change_1 = require("./on-did-change");
const utils_1 = require("../utils");
function onDidChangeFiles(events) {
    // @ts-ignore
    const paths = events.map(({ path }) => [path, utils_1.getModuleByPath(path)]);
    const uniqPaths = new Set(paths);
    [...uniqPaths]
        .filter(([, module]) => !!module)
        .forEach(async ([path, module]) => {
        try {
            await on_did_change_1.onDidChange(path, module);
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.onDidChangeFiles = onDidChangeFiles;
//# sourceMappingURL=on-did-change-files.js.map