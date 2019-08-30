import { default as store, Action } from '../index';
import { LOCAL_FILE_MODIFY } from '../actions';
import { default as __state } from '../../state';

store.reducer((state: IState, { type, payload: {
    projectPath,
    filePath,
    modified
} }: Action): IState => {
    if (type !== LOCAL_FILE_MODIFY) {
        return state;
    }

    const branch = state.projects[projectPath].branch;

    const files = state.files || {};

    return {
        ...state,
        files: {
            ...files,
            [branch]: {
                ...files[branch],
                [filePath]: modified
            }
        }
    };
});
