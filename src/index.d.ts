
interface IState {
    branch: string;
    branches: IBranch[];

    modules: {
        [key: string]: IModules;
    }
}
