import { Action } from '../../../store';

export const OPEN_TEXT_EDITOR = 'OPEN_TEXT_EDITOR';
export function OpenTextEditorAction(branch: string, module: string): Action {
    return {
        type: OPEN_TEXT_EDITOR,
        payload: {
            module,
            branch
        }
    }
}
