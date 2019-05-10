import { Action } from '../../../store';

export const MODIFY_MODULE = 'MODIFY_MODULE';
export function ModifyModuleAction(module: string, modified: boolean): Action {
    return {
        type: MODIFY_MODULE,
        payload: {
            module,
            modified
        }
    }
}
