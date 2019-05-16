import { Action } from '../../../store';

export const ADD_PROJECT = 'ADD_PROJECT';
export function AddProjectAction(): Action {
    return {
        type: ADD_PROJECT,
        payload: { }
    }
}
