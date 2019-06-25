import { Action } from '../';

export const CREATE_PROJECT = 'CREATE_PROJECT';
export function CreateProjectAction(): Action {
    return {
        type: CREATE_PROJECT,
        payload: {}
    }
}
