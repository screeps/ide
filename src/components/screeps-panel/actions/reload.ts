import { Action } from '../../../store';

export const RELOAD_STATE = 'RELOAD_STATE';
export function ReloadStateAction(): Action {
    return {
        type: RELOAD_STATE,
        payload: { }
    }
}
