const path = require('path');

import { File, Directory } from 'atom';

import { getApi } from '../utils';
import { configGetter } from '../config';

export async function commitCommand(branch: string) {
    const api = await getApi();

    let srcDir = configGetter('src');

    const modules = await readUserCode(srcDir);
    return api.updateUserCode({ branch, modules });
}

async function readUserCode(srcDir: string) {
    const projectPath = atom.project.getPaths()[0];
    const fullPath = path.resolve(projectPath, srcDir);

    const dir = new Directory(fullPath);
    const entries = dir.getEntriesSync();

    const files = entries.filter((entry) => {
        return entry.isFile();
    }) as File[];

    const modules: { [key: string]: String } = {};

    for (let file of files) {
        const content = await file.read(true) as String;
        const fileName = file.getBaseName()
            .replace('.js', '');

        modules[fileName] = content;
    }

    return modules;
}

// (function() {
//   return 1;
//
//   if (!/mycode/.test(atom.project.getPaths()[0])) {
//     return 0;
//   }
//
//   atom.project.onDidChangeFiles(async (events) => {
//     console.log(1, events);
//
//     for (const { action } of events) { // action, path
//       if (action === 'modified') {
//         changeFilesSbj.next({ type: action });
//       }
//     }
//   });
//
//   changeFiles$
//     .pipe(filter(({ type }) => type === 'modified'))
//     .pipe(switchMap(readCode))
//     .pipe(map((modules) => ({ branch: 'default', modules })))
//     .pipe(tap((data) => api.updateUserCode(data)))
//     .subscribe();
// })();
