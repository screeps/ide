interface IBranches {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IModulesViewProps {
    modules: IModules;

    branch: string;
    branches: IBranches[];

    onClose?(): Promise<void>;

    onChooseModules?(): Promise<void>;
    onChooseBranches?(): Promise<void>;
    onCopyBranch?(branch: string): Promise<void>;
    onSelectBranch?(branch: string): Promise<void>;
    onDeleteBranch?(branch: string): Promise<void>;
    onSelectModule?(branch: string): Promise<void>;
}

interface IModulesViewState {
    isProgressing: boolean;

    modules: IModules;

    branch: string;
    branches: IBranches[];

    isShowingBranches: boolean;
}
