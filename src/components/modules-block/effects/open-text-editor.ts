import { File, TextEditor } from 'atom';
import { merge } from 'rxjs';
import { map, tap, distinctUntilChanged, filter } from 'rxjs/operators';

import { default as store, Action } from '../../../store';
import { default as __state } from '../../../state';
import {
    OPEN_TEXT_EDITOR,
    UpdateModuleAction,
    DeleteModuleAction,
    ModifyModuleAction
} from '../actions';

import { getModulePath } from '../../../utils';

export const openTExtEditorEffect = store
.effect(async ({ modules: _modules }: IState, { type, payload: { module, branch }}: Action) => {
    if (type !== OPEN_TEXT_EDITOR) {
        return;
    }

    const path = getModulePath(branch, module);

    let textEditor = atom.workspace.getTextEditors()
        .find((textEditor) => textEditor.getPath() === path);

    let file = new File(path);
    let isNew = false;

    const modules = _modules[branch];

    if (!textEditor) {
        const isExist = await file.exists();

        const { content = '', modified } = modules[module];

        if (!isExist && content) {
            await file.create();
        }
        if (!modified && content) {
            await file.write(content);
        }

        isNew = !!modified;

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
    }

    if (textEditor.getTitle() !== `@${ branch }/${ module }.js`) {
        textEditor.getTitle = () => `@${ branch }/${ module }.js`;

        const subscriber = merge(
            __state.pipe(map(({ modules }) => modules[branch][module]))
                .pipe(distinctUntilChanged())
                .pipe(filter((_) => !!_))
                .pipe(tap(async ({ content }) => {
                    await file.write(content || '');

                    if (!content) {
                        return;
                    }

                    // @ts-ignore
                    textEditor.buffer.loadSync();
                })),

            __state.pipe(map(({ modules }) => modules[branch][module]))
                .pipe(distinctUntilChanged())
                .pipe(filter((_) => !_))
                .pipe(tap(() => {
                    isNew = true;

                    // @ts-ignore
                    textEditor.buffer.loadSync();
                }))
        ).subscribe();

        textEditor.onDidSave(() => {
            isNew = false;

            if (!textEditor) {
                return;
            }

            const content = textEditor.getText();

            store.dispatch(UpdateModuleAction(branch, module, content));
        });

        textEditor.onDidDestroy(() => {
            subscriber.unsubscribe();

            if (!isNew) {
                store.dispatch(ModifyModuleAction(branch, module, false));
                return;
            }

            store.dispatch(DeleteModuleAction(branch, module));
        });

        textEditor.onDidChange(() => {
            // @ts-ignore
            const modified = textEditor.buffer.isModified();
            store.dispatch(ModifyModuleAction(branch, module, modified));
        });

        // @ts-ignore
        textEditor.emitter.emit('did-change-title', textEditor.getTitle())
    }

    atom.workspace.open(textEditor, {
        searchAllPanes: true
    });
});
