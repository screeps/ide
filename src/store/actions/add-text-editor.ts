import { Action } from '../';

export const ADD_TEXT_EDITOR = 'ADD_TEXT_EDITOR';
export function AddTextEditorAction(filePath: string | undefined): Action {
    return {
        type: ADD_TEXT_EDITOR,
        payload: {
            filePath
        }
    }
}
