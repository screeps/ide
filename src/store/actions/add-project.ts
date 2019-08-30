import { Action } from '../';

export const ADD_PROJECT = 'ADD_PROJECT';
export function AddProjectAction(projectPath: string, branch: string, files: any): Action {
    return {
        type: ADD_PROJECT,
        payload: {
            projectPath,
            branch,
            files
        }
    }
}
