"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCAL_FILE_MODIFY = 'LOCAL_FILE_MODIFY';
function LocalFileModifyAction(projectPath, filePath, modified) {
    return {
        type: exports.LOCAL_FILE_MODIFY,
        payload: {
            projectPath,
            filePath,
            modified
        }
    };
}
exports.LocalFileModifyAction = LocalFileModifyAction;
//# sourceMappingURL=local-file-modify.js.map