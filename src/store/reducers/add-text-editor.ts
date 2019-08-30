import { default as store, Action } from '../index';
import {
    ADD_TEXT_EDITOR
} from '../actions';
import { default as __state } from '../../state';

store.reducer((state: IState, { type, payload: { filePath } }: Action): IState => {
    if (type !== ADD_TEXT_EDITOR) {
        return state;
    }

    if (!filePath) {
        return state;
    }

    const projectPath = selectProjectPath(filePath);
    if (!projectPath) {
        return state;
    }

    const project = state.projects[projectPath];
    const file = project.files[filePath];

    if (file) {
        return state;
    }

    return {
        ...state,
        projects: {
            ...state.projects,
            [projectPath] : {
                ...project,
                files: {
                    ...project.files,
                    [filePath]: {
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