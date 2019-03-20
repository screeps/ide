import { File, Directory } from 'atom';

import { getApi } from '../utils';
import { configGetter } from '../config';

export async function commitCommand(branch: string) {
    const api = await getApi();

    let srcDir = configGetter('src');

    const modules = await readUserCode(srcDir);
    return api.updateUserCode({ branch, modules });
}

export async function readUserCode(fullPath: string) {
    const dir = new Directory(fullPath);
    const entries = dir.getEntriesSync();

    const files = entries.filter((entry) => {
        return entry.isFile();
    }) as File[];

    const modules: { [key: string]: string } = {};

    for (let file of files) {
        const content = await file.read(true) as string;
        const fileName = file.getBaseName()
            .replace('.js', '');

        modules[fileName] = content;
    }

    return modules;
}
