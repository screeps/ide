import { default as store, Action } from '../index';
import { ADD_PROJECT } from '../actions';
import { default as __state } from '../../state';

store.reducer((state: IState, { type, payload: { projectPath, branch, files } }: Action): IState => {
    if (type !== ADD_PROJECT) {
        return state;
    }

    files = files || {};
    const projects = state.projects || {};

    return {
        ...state,
        projects: {
            ...projects,
            [projectPath]: {
                branch,
                files
            }
        }
    };
});
