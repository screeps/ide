"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADD_TEXT_EDITOR = 'ADD_TEXT_EDITOR';
function AddTextEditorAction(filePath) {
    return {
        type: exports.ADD_TEXT_EDITOR,
        payload: {
            filePath
        }
    };
}
exports.AddTextEditorAction = AddTextEditorAction;
//# sourceMappingURL=add-text-editor.js.map