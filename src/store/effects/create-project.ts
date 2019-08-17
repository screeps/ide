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
    LOCAL_PROJECT_CONFIG,
    TERN_CONFIG,
    createScreepsTernConfig,
    createScreepsProjectConfig
} from '../../utils';

export const createProjectEffect = store
.effect(async (state: IState, { type, payload }: Action): Promise<void> => {
    if (CREATE_PROJECT !== type) {
        return;
    }

    let subscriptions: CompositeDisposable;

    try {
        // Check auth.
        const api = await getApi();

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

            // Update branches.
            api.getUserBranches().then(({ list: branches }) => {
                if (createProjectModal) {
                    createProjectModal.ref.setBranches(branches);
                }

                // Save to store.
                __state.next({
                    ...__state.getValue(),
                    branches
                });
            });

            createProjectModal.events$
                .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
                .pipe(tap(() => createProjectModal.hide()))
                .pipe(tap(({ payload }) => resolve(payload)))
                .subscribe();

            createProjectModal.events$
                .pipe(filter(({ type }) => type === 'MODAL_CANCEL'))
                .pipe(tap(() => projectPath && atom.project.removePath(projectPath)))
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

        await createScreepsTernConfig(projectPath, { libs: ['screeps'] });
        await createScreepsProjectConfig(projectPath, { branch });

        if (download) {
            try {
                if (!payload.downloadForce) {
                    let projectEntries = await projectDir.getEntriesSync();
                    const filter = new RegExp(`((${ LOCAL_PROJECT_CONFIG })|(${ TERN_CONFIG }))$`);
                    projectEntries = projectEntries.filter((entry) => !filter.test(entry.getPath()));

                    if (projectEntries.length) {
                        await confirm({
                            legend: 'Folder is not empty! Would you like to continue?'
                        });
                    }
                }

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
