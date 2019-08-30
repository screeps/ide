import { BehaviorSubject } from 'rxjs';

export const INITIAL_STATE = {
    branch: '',
    branches: [],
    modules: {
        default: {
        }
    },
    projects: {},
    files: {}
};

const __state = new BehaviorSubject<IState>(INITIAL_STATE);

const next = __state.next;
__state.next = function(...args) {
    // console.log(.1, 'next', ...args);
    return next.apply(this, args);
}

export default __state;

export function selectModules(branch: string): IModulesData {
    const { modules } = __state.getValue();

    return Object.entries(modules[branch])
        .reduce((modules, [module, { content, deleted, isNew }]) => {
            if (!deleted && !isNew) {
                modules[module] = content;
            }

            return modules;
        }, {} as IModulesData);
}

export function selectProjectPath(filePath: string): string | undefined {
    const { projects } = __state.getValue();

    if (!projects) {
        return;
    }

    const projectPath = Object.keys(projects).find((projectPath) => {
        return filePath.includes(projectPath);
    });

    return projectPath;
}
