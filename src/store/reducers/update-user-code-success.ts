const path = require('path');

import { default as store, Action } from '../index';
import { UPDATE_USER_CODE_SUCCESS } from '../actions';
import { default as __state } from '../../state';
import {
    hashCode
} from '../../utils';

store.reducer((state: IState, { type, payload: { projectPath, modules } }: Action): IState => {
    if (type !== UPDATE_USER_CODE_SUCCESS) {
        return state;
    }

    const project = state.projects[projectPath];
    const files: { [key: string]: { hash: number } } = {};

    for (const moduleName in modules) {
        const content = modules[moduleName];
        const modulePath = path.resolve(projectPath, moduleName);

        const hash = hashCode(content || '');

        files[`${ modulePath }.js`] = { hash };
    }

    return {
        ...state,
        projects: {
            ...state.projects,
            [projectPath]: {
                ...project,
                files
            }
        }
    };
});
