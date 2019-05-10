import { File, TextEditor } from 'atom';
import { map, tap } from 'rxjs/operators';

import { default as store, Action } from '../../../store';
import { default as __state } from '../../../state';
import {
    OPEN_TEXT_EDITOR,
    UpdateModuleAction,
    DeleteModuleAction,
    ModifyModuleAction
} from '../actions';

import {
    getModulePath,
} from '../../../utils';

export const openTExtEditorEffect = store
.effect(async ({ branch, modules }: IState, { type, payload: { module }}: Action) => {
    if (type !== OPEN_TEXT_EDITOR) {
        return;
    }

    const path = getModulePath(branch, module);

    let textEditor = atom.workspace.getTextEditors()
        .find((textEditor) => textEditor.getPath() === path);

    if (textEditor) {
        atom.workspace.open(textEditor, {
            searchAllPanes: true
        });

        return;
    }

    const file = new File(path);
    const isExist = await file.exists();
    const { content = '', modified } = modules[module];

    if (!isExist && content) {
        await file.create();
    }

    if (!modified && content) {
        await file.write(content);
    }

    let isNew = modified;

    textEditor = atom.workspace.buildTextEditor({
        autoHeight: false
    }) as TextEditor;

    if (modified && content) {
        textEditor.setText(content);
    }

    const buffer = textEditor.getBuffer();

    buffer.setPath(path);
    // @ts-ignore
    buffer.loadSync();

    textEditor.getTitle = () => `@${ branch }/${ module }.js`;

    __state.pipe(map(({ modules }) => modules[module]))
        .pipe(tap(async ({ content }) => {
            await file.write(content || '');

            if (content) {
                // @ts-ignore
                textEditor.buffer.loadSync();
            }
        }))
        .subscribe();

    textEditor.onDidSave(() => {
        isNew = false;

        if (!textEditor) {
            return;
        }

        const content = textEditor.getText();

        store.dispatch(UpdateModuleAction(module, content));
    });

    textEditor.onDidDestroy(() => {
        if (!isNew) {
            store.dispatch(ModifyModuleAction(module, false));
            return;
        }

        store.dispatch(DeleteModuleAction(module));
    });

    textEditor.onDidChange(() => {
        // @ts-ignore
        const modified = textEditor.buffer.isModified();
        store.dispatch(ModifyModuleAction(module, modified));
    });

    atom.workspace.open(textEditor, {
        searchAllPanes: true
    });
});
