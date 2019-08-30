import { Action } from '..';

export const UPDATE_USER_CODE_SUCCESS = 'UPDATE_USER_CODE_SUCCESS';
export function UpdateUserCodeSuccessAction(branch: string): Action {
    return {
        type: UPDATE_USER_CODE_SUCCESS,
        payload: {
            branch
        }
    }
}
