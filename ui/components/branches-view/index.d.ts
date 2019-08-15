interface IBranch {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IBranchesViewProps {
    isProgressing?: boolean;
    active?: string;

    branches: IBranch[];

    onCopyBranch?(branch: string): Promise<void>;
    onSelectBranch?(branch: string): Promise<void>;
    onDeleteBranch?(branch: string): Promise<void>;

    onSetActiveSim?(branch: string): Promise<void>;
    onSetActiveWorld?(branch: string): Promise<void>;
}
