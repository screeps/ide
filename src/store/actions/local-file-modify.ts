import { Action } from '..';

export const LOCAL_FILE_MODIFY = 'LOCAL_FILE_MODIFY';
export function LocalFileModifyAction(projectPath: string, filePath: string, modified: boolean): Action {
    return {
        type: LOCAL_FILE_MODIFY,
        payload: {
            projectPath,
            filePath,
            modified
        }
    }
}
