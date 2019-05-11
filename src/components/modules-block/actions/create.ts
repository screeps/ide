import { Action } from '../../../store';

export const CREATE_MODULE = 'CREATE_MODULE';
export function CreateModuleAction(branch: string, module: string): Action {
    return {
        type: CREATE_MODULE,
        payload: {
            branch,
            module
        }
    }
}
