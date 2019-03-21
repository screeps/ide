interface IBranches {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IModule {
    content: string;
    modified?: boolean;
    deleted?: boolean;
}

interface IModulesViewModules {
    [key: string]: IModule;
}

interface IModulesViewProps {
    modules: IModulesViewModules;

    branch: string;
    branches: IBranches[];

    onClose?(): Promise<void>;

    onChooseModules?(): Promise<void>;
    onChooseBranches?(): Promise<void>;
    onCopyBranch?(branch: string): Promise<void>;

    onSelectBranch?(branch: string): Promise<void>;
    onDeleteBranch?(branch: string): Promise<void>;

    onCreateModule?(module: string): Promise<void>;
    onSelectModule?(module: string): Promise<void>;
    onDeleteModule?(module: string): Promise<void>;

    onApplyChanges?(): Promise<void>;
    onRevertChanges?(): Promise<void>;
}

interface IModulesViewState {
    modules: IModulesViewModules;

    branch: string;
    branches?: IBranches[];

    isProgressing?: boolean;
    isShowingBranches?: boolean;
}
