const fs = require('fs');
const path = require('path');

import { default as store, Action } from '../../../store';
import { default as prompt } from '../../prompt-modal';
import { CREATE_PROJECT } from '../actions';

import {
    AddProjectAction
} from '../actions';

export const createProjectEffect = store
.effect(async (state: IState, { type }: Action): Promise<void> => {
    state;
    if (CREATE_PROJECT !== type) {
        return;
    }

    try {
        const projectPath = await prompt({
            legend: 'Please enter a new project fodler path:'
        });

        try {
            mkdir(projectPath);
        } catch(err) {
            return;
        }

        atom.project.addPath(projectPath);
        store.dispatch(AddProjectAction());
    } catch(err) {
        throw err;
    }
});

function mkdir(targetDir: string) {
    const sep = path.sep;

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve('/', parentDir, childDir);

        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code === 'EEXIST') {
                return curDir;
            }

            if (err.code === 'ENOENT') {
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw err;
            }
        }

        return curDir;
    });
}
