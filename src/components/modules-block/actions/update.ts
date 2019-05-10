import { Action } from '../../../store';

export const UPDATE_MODULE = 'UPDATE_MODULE';
export function UpdateModuleAction(module: string, content: string): Action {
    return {
        type: UPDATE_MODULE,
        payload: {
            module,
            content
        }
    }
}
