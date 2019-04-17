import { onDidChange } from './on-did-change';
import { getModuleByPath } from '../utils';

export function onDidChangeFiles(events: any) {
    // @ts-ignore
    const paths = events.map(({ path }) => [path, getModuleByPath(path)]);
    const uniqPaths = new Set<[string, string | null]>(paths);

    [...uniqPaths]
        .filter(([, module]) => !!module)
        .forEach(async ([path, module]) => {
            try {
                await onDidChange(path, module as string);
            } catch (err) {
                console.error(err);
            }
        });
    }