"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPEN_TEXT_EDITOR = 'OPEN_TEXT_EDITOR';
function OpenTextEditorAction(branch, module) {
    return {
        type: exports.OPEN_TEXT_EDITOR,
        payload: {
            module,
            branch
        }
    };
}
exports.OpenTextEditorAction = OpenTextEditorAction;
//# sourceMappingURL=open-text-editor.js.map