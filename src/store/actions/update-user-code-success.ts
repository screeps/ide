import { Action } from '..';

export const UPDATE_USER_CODE_SUCCESS = 'UPDATE_USER_CODE_SUCCESS';
export function UpdateUserCodeSuccessAction(projectPath: string, branch: string, modules: any): Action {
    return {
        type: UPDATE_USER_CODE_SUCCESS,
        payload: {
            projectPath,
            branch,
            modules
        }
    }
}
