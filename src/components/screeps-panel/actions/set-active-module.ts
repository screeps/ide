import { Action } from '../../../store';

export const SET_ACTIVE_MODULE = 'SET_ACTIVE_MODULE';
export function SetActiveModule(branch: string | null, module: string | null): Action {
    return {
        type: SET_ACTIVE_MODULE,
        payload: {
            branch,
            module
        }
    }
}
