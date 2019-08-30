
interface IState {
    branch: string;
    branches: IBranch[];

    modules: {
        [key: string]: IModules;
    };

    projects: {
        // Projet Path
        [key: string]: {
            branch: string;
        };
    }

    files: {
        // Branch Name
        [key: string]: {
            // File Path : modified
            [key: string]: boolean;
        };
    };

    activeBranchTextEditor?: string;
    activeModuleTextEditor?: string;
}
