interface IModule {
    content: string | null;
    modified?: boolean;
    deleted?: boolean;
    active?: boolean;
}

interface IModules {
    [key: string]: IModule;
}

interface IModulesViewProps {
    branch: string;
    modules: IModules;

    onCreateModule?(module: string): Promise<void>;
    onSelectModule?(module: string): Promise<void>;
    onDeleteModule?(module: string): Promise<void>;

    onApplyChanges?(): Promise<void>;
    onRevertChanges?(): Promise<void>;
}
