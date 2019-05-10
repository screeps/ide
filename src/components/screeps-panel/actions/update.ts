import { Action } from '../../../store';

export const UPDATE_MODULES = 'UPDATE_MODULES';
export function UpdateModulesAction(modules: IModulesData): Action {
    return {
        type: UPDATE_MODULES,
        payload: {
            modules
        }
    }
}
