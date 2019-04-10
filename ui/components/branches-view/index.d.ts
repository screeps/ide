interface IBranchesViewProps {
    branch: string | undefined;
    branches: IBranch[];

    onBranch?(branch: string): void;
}

interface IBranchesViewState {
    branch: string;
    view: 'SELECT' | 'CREATE'
}
