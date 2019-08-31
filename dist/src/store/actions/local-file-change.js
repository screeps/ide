"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCAL_FILE_CHANGE = 'LOCAL_FILE_CHANGE';
function LocalFileChangeAction(filePath, content) {
    return {
        type: exports.LOCAL_FILE_CHANGE,
        payload: {
            filePath,
            content
        }
    };
}
exports.LocalFileChangeAction = LocalFileChangeAction;
//# sourceMappingURL=local-file-change.js.map