interface IModule {
    content: string | null;
    isNew?: boolean;
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

    active?: string;

    onCreateModule?(module: string): Promise<void>;
    onSelectModule?(module: string, textEditorPending: boolean): Promise<void>;
    onDeleteModule?(module: string): Promise<void>;
}
