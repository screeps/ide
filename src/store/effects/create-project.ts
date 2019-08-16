const fs = require('fs');
const path = require('path');

import { File, Directory, CompositeDisposable } from 'atom';
import { filter, tap } from 'rxjs/operators';

import __state from '../../state';
import { default as store, Action } from '..';
import { AtomModal } from '../../components/atom-modal';
import { default as confirm } from '../../components/confirm-modal';
import { default as CreateProjectView } from '../../../ui/components/create-project-view';
import { CREATE_PROJECT } from '../actions';

import {
    getApi,
    createScreepsProjectConfig
} from '../../utils';

export const createProjectEffect = store
.effect(async (state: IState, { type, payload }: Action): Promise<void> => {
    state;
    if (CREATE_PROJECT !== type) {
        return;
    }

    let subscriptions: CompositeDisposable;

    try {
        const settings: any = await new Promise((resolve, reject) => {
            let projectPath: string;

            const createProjectModal = new AtomModal(CreateProjectView, {
                branch: state.branch,
                branches: state.branches,
                projectPathReadonly: true,
                ...payload,
                onClick() {
                    // @ts-ignore
                    atom.commands.dispatch(atom.workspace.element, 'application:add-project-folder');

                    subscriptions && subscriptions.dispose();
                    subscriptions = new CompositeDisposable(); 
                    const disposable = atom.project.onDidChangePaths((paths) => {
                        projectPath = paths[paths.length - 1];

                        createProjectModal.ref.setProjectPathValue(projectPath);
                    });
                    subscriptions.add(disposable);
                }
            });

            createProjectModal.events$
                .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
                .pipe(tap(() => createProjectModal.hide()))
                .pipe(tap(({ payload }) => resolve(payload)))
                .subscribe();

            createProjectModal.events$
                .pipe(filter(({ type }) => type === 'MODAL_CANCEL'))
                .pipe(tap(() => atom.project.removePath(projectPath)))
                .pipe(tap(() => reject(null)))
                .subscribe();
            
            createProjectModal.events$
                .pipe(tap(() => {
                    // @ts-ignore
                    subscriptions && subscriptions.dispose();
                }))
                .subscribe();
        });

        const { projectPath, download, branch } = settings;
        const projectDir = mkdir(projectPath);

        const configFile = await createScreepsProjectConfig(projectPath, {
            branch
        });

        if (download) {
            try {
                const projectEntries = await projectDir.getEntriesSync();

                if (!payload.downloadForce) {
                    if ((projectEntries.length > 1) ||
                        (projectEntries.length === 1 && projectEntries[0].getPath() !== configFile.getPath())
                    ) {
                        await confirm({
                            legend: 'Folder is not empty! Would you like to continue?'
                        });
                    }
                }

                const api = await getApi();
                const { modules } = await api.getUserCode(branch);

                for (const moduleName in modules) {
                    const content = modules[moduleName];
                    const modulePath = path.resolve(projectPath, moduleName);

                    const moduleFile = new File(`${ modulePath }.js`);
                    await moduleFile.write(content || '');
                }

            } catch(err) {
                // Noop.
            }
        }

        atom.project.addPath(projectPath);
        store.dispatch({ type: 'CHANGE_PROJECT', payload: {} })
    } catch(err) {
        throw err;
    }
});

function mkdir(targetDir: string): Directory {
    const sep = path.sep;

    const dir = targetDir.split(sep).reduce((parentDir, childDir) => {
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

    return new Directory(dir);
}
