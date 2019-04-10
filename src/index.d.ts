
interface IState {
    branch?: string;
    modules?: {
        [key: string]: IModule;
    }
}
