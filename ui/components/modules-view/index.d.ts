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

    onChooseModules?: Function;
    onChooseBranches?: Function;
    onCopyBranch?: Function;
    onSelectBranch?: Function;
    onDeleteBranch?: Function;
    onSelectModule?: Function;
}

interface IModulesViewState {
    modules: IModules;

    branch: string;
    branches: IBranches[];

    isShowingBranches: boolean;
}
