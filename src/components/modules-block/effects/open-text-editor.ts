import { File, TextEditor, TextBuffer } from 'atom';
import { merge } from 'rxjs';
import { map, tap, distinctUntilChanged, filter } from 'rxjs/operators';

import { default as store, Action } from '../../../store';
import { default as __state, selectModules } from '../../../state';
import {
    OPEN_TEXT_EDITOR,
    DeleteModuleAction,
    ModifyModuleAction
} from '../actions';
import {
    updateUserCode
} from '../../../actions';

import { getModulePath } from '../../../utils';

export const openTextEditorEffect = store
.effect(async ({ modules: _modules }: IState, { type, payload: { module, branch, textEditorPending }}: Action) => {
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
        const { content = '', modified } = modules[module];

        isNew = !!modified;

        if (!modified && content) {
            await file.write(content);
        }

        textEditor = atom.workspace.buildTextEditor({
            autoHeight: false
        }) as TextEditor;

        if (modified && content) {
            textEditor.setText(content);
        }

        const buffer: TextBuffer = textEditor.getBuffer();

        buffer.setPath(path);
        // @ts-ignore
        buffer.loadSync({ internal: true });
    }

    if (textEditor.getTitle() !== `@${ branch }/${ module }`) {
        textEditor.getTitle = () => `@${ branch }/${ module }`;

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
                    textEditor.buffer.loadSync({ internal: true });
                })),

            __state.pipe(map(({ modules }) => modules[branch][module]))
                .pipe(distinctUntilChanged())
                .pipe(filter((_) => !_))
                .pipe(tap(() => {
                    isNew = true;

                    // @ts-ignore
                    textEditor.buffer.loadSync({ internal: true });
                }))
        ).subscribe();

        const textBuffer: TextBuffer = textEditor.getBuffer();

        textBuffer.onWillSave(() => {
            const modules: IModulesData = {
                ...selectModules(branch),
                [module]: textBuffer.getText()
            };

            return updateUserCode(branch, modules);
        });

        textEditor.onDidSave(() => {
            isNew = false;
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
        pending: textEditorPending,
        activatePane: false,
        searchAllPanes: true
    });
});
