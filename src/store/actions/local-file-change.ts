import { Action } from '../';

export const LOCAL_FILE_CHANGE = 'LOCAL_FILE_CHANGE';
export function LocalFileChangeAction(path: string, content: string): Action {
    return {
        type: LOCAL_FILE_CHANGE,
        payload: {
            path,
            content
        }
    }
}
