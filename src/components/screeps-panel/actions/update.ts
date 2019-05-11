import { Action } from '../../../store';

export const UPDATE_MODULES = 'UPDATE_MODULES';
export function UpdateModulesAction(branch: string, modules: IModulesData): Action {
    return {
        type: UPDATE_MODULES,
        payload: {
            branch,
            modules
        }
    }
}
