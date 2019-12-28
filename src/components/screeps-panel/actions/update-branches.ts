import { Action } from '../../../store';

export const UPDATE_BRANCHES = 'UPDATE_BRANCHES';
export function UpdateBranchesAction(branches: any[]): Action {
    return {
        type: UPDATE_BRANCHES,
        payload: {
            branches
        }
    }
}
