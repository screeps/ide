import { default as store, Action } from '../index';
import {
    LOCAL_FILE_CHANGE
} from '../actions';
import { default as __state } from '../../state';
import {
    hashCode
} from '../../utils';``

store.reducer((state: IState, { type, payload: {
    filePath,
    content
} }: Action): IState => {
    if (type !== LOCAL_FILE_CHANGE) {
        return state;
    }

    const projectPath = selectProjectPath(filePath);
    if (!projectPath) {
        return state;
    }

    const project = state.projects[projectPath];
    const file = project.files[filePath] || {};

    const hash = hashCode(content);
    const modified = file.hash !== hash;

    return {
        ...state,
        projects: {
            ...state.projects,
            [projectPath] : {
                ...project,
                files: {
                    ...project.files,
                    [filePath]: {
                        ...file,
                        modified
                    }
                }
            }
        }
    };
});

function selectProjectPath(filePath: string): string | undefined {
    const { projects } = __state.getValue();

    if (!projects) {
        return;
    }

    const projectPath = Object.keys(projects).find((projectPath) => {
        return filePath.includes(projectPath);
    });

    return projectPath;
}