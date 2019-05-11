import { Action } from '../../../store';

export const DELETE_MODULE = 'DELETE_MODULE';
export function DeleteModuleAction(branch: string, module: string): Action {
    return {
        type: DELETE_MODULE,
        payload: {
            branch,
            module
        }
    }
}
