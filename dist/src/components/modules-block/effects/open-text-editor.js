"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const store_1 = require("../../../store");
const state_1 = require("../../../state");
const actions_1 = require("../actions");
const utils_1 = require("../../../utils");
exports.openTExtEditorEffect = store_1.default
    .effect(async ({ modules: _modules }, { type, payload: { module, branch } }) => {
    if (type !== actions_1.OPEN_TEXT_EDITOR) {
        return;
    }
    const path = utils_1.getModulePath(branch, module);
    let textEditor = atom.workspace.getTextEditors()
        .find((textEditor) => textEditor.getPath() === path);
    let file = new atom_1.File(path);
    let isNew = false;
    const modules = _modules[branch];
    if (!textEditor) {
        const isExist = await file.exists();
        const { content = '', modified } = modules[module];
        isNew = !!modified;
        if (!isExist && content) {
            try {
                await file.create();
            }
            catch (err) {
                atom.notifications.addError(err.toString());
                if (isNew) {
                    store_1.default.dispatch(actions_1.DeleteModuleAction(branch, module));
                }
                return;
            }
        }
        if (!modified && content) {
            await file.write(content);
        }
        textEditor = atom.workspace.buildTextEditor({
            autoHeight: false
        });
        if (modified && content) {
            textEditor.setText(content);
        }
        const buffer = textEditor.getBuffer();
        buffer.setPath(path);
        // @ts-ignore
        buffer.loadSync({ internal: true });
    }
    if (textEditor.getTitle() !== `@${branch}/${module}.js`) {
        textEditor.getTitle = () => `@${branch}/${module}.js`;
        const subscriber = rxjs_1.merge(state_1.default.pipe(operators_1.map(({ modules }) => modules[branch][module]))
            .pipe(operators_1.distinctUntilChanged())
            .pipe(operators_1.filter((_) => !!_))
            .pipe(operators_1.tap(async ({ content }) => {
            await file.write(content || '');
            if (!content) {
                return;
            }
            // @ts-ignore
            textEditor.buffer.loadSync({ internal: true });
        })), state_1.default.pipe(operators_1.map(({ modules }) => modules[branch][module]))
            .pipe(operators_1.distinctUntilChanged())
            .pipe(operators_1.filter((_) => !_))
            .pipe(operators_1.tap(() => {
            isNew = true;
            // @ts-ignore
            textEditor.buffer.loadSync({ internal: true });
        }))).subscribe();
        textEditor.onDidSave(() => {
            isNew = false;
            if (!textEditor) {
                return;
            }
            const content = textEditor.getText();
            store_1.default.dispatch(actions_1.UpdateModuleAction(branch, module, content));
        });
        textEditor.onDidDestroy(() => {
            subscriber.unsubscribe();
            if (!isNew) {
                store_1.default.dispatch(actions_1.ModifyModuleAction(branch, module, false));
                return;
            }
            store_1.default.dispatch(actions_1.DeleteModuleAction(branch, module));
        });
        textEditor.onDidChange(() => {
            // @ts-ignore
            const modified = textEditor.buffer.isModified();
            store_1.default.dispatch(actions_1.ModifyModuleAction(branch, module, modified));
        });
        // @ts-ignore
        textEditor.emitter.emit('did-change-title', textEditor.getTitle());
    }
    atom.workspace.open(textEditor, {
        searchAllPanes: true
    });
});
//# sourceMappingURL=open-text-editor.js.map