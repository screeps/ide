import { default as store, Action } from '../index';
import { UPDATE_USER_CODE_SUCCESS } from '../actions';
import { default as __state } from '../../state';

store.reducer((state: IState, { type, payload: { branch } }: Action): IState => {
    if (type !== UPDATE_USER_CODE_SUCCESS) {
        return state;
    }

    const branchFiles = state.files[branch] || {};

    return {
        ...state,
        files: {
            ...state.files,
            [branch]: Object.keys(branchFiles).reduce((acc, filePath) => {
                acc[filePath] = false;

                return acc;
            }, {} as { [key: string]: boolean })
        }
    };
});
