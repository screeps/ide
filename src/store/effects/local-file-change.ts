
import { default as store, Action } from '../index';
import {
    LOCAL_FILE_CHANGE,
    LocalFileModifyAction
} from '../actions';
import { default as __state } from '../../state';
import {
    getScreepsProjectConfig
} from '../../utils';``

export const locaFileChangeEffect = store
.effect(async (state: IState, { type, payload: { path, content } }: Action): Promise<void> => {
    if (type !== LOCAL_FILE_CHANGE) {
        return;
    }

    const projectPath = selectProjectPath(path);
    if (!projectPath) {
        return;
    }

    const matches = /.*([^\\]+)\.js$/gm.exec(path);
    if (!matches) {
        return;
    }

    const [, module] = matches;
    const { branch } = await getScreepsProjectConfig(projectPath);

    const modified = content !== state.modules[branch][module].content;

    store.dispatch(LocalFileModifyAction(projectPath, path, modified));
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