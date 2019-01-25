import * as React from 'react';

interface IBranches {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IModules {
    [key: string]: string;
}

interface IModulesViewProps {
    modules: IModules;

    branch: string;
    branches: IBranches[];

    onChooseModules?: Function;
    onChooseBranches?: Function;
    onSelectBranch?: Function;
    onSelectModule?: Function;
}

interface IModulesViewState {
    isShowingBranches: boolean;
}

class ModulesView extends React.Component<IModulesViewProps> {
    //@ts-ignore
    props: IModulesViewProps;

    state: IModulesViewState;

    constructor(props: IModulesViewProps) {
        super(props);
        this.state = { isShowingBranches: false }
    }

    onChooseModules = () => {
        this.setState({ isShowingBranches: false });
        this.props.onChooseModules && this.props.onChooseModules();
    }

    onChooseBranches = () => {
        this.setState({ isShowingBranches: true });
        this.props.onChooseBranches && this.props.onChooseBranches();
    }

    onSelectBranch = (branchName: string) => {
        this.setState({ isShowingBranches: false });
        this.props.onSelectBranch && this.props.onSelectBranch(branchName);
    }

    onSelectModule = (moduleName: string) => {
        // this.setState({ isShowingBranches: true });
        this.props.onSelectModule && this.props.onSelectModule(moduleName);
    }

    public render() {
        let view;
        let header;

        if (this.state.isShowingBranches) {
            header = (
                <div className='screeps-modules-view__header'>
                    <span>Choose active branch:</span>
                    <button className='btn icon' onClick={this.onChooseModules}>
                        <i className='sc-icon-clear' />
                    </button>
                </div>
            );

            view = (
                <ul className='screeps-modules-view__branches'>
                {this.props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                    let deleteButton;
                    let sim;
                    let world;

                    if (!activeSim && !activeWorld) {
                        deleteButton = <button><i className='sc-icon-delete' /></button>;
                    }

                    if (activeWorld) {
                        world = <span className='screeps-modules-view__active'>world</span>;
                    }

                    if (activeSim) {
                        sim = <span className='screeps-modules-view__active'>sim</span>;
                    }


                    return (
                        <li className='screeps-modules-view__branch' key={_id}>
                            <button onClick={() => this.onSelectBranch(branch)}>{ branch } { world } { sim }</button>
                            <button><i className='sc-icon-copy' /></button>
                            { deleteButton }
                        </li>
                    )
                })}
                </ul>
            );
        } else {
            header = (
                <div className='screeps-modules-view__header'>
                    <span>Branch</span>
                    <button onClick={this.onChooseBranches}>{ this.props.branch }</button>
                </div>
            )

            view = (
                <div>
                    <ul className='screeps-modules-view__items'>
                        <li className='screeps-modules-view__item'>
                            <button onClick={() => this.onSelectModule('main')}>main</button>
                            <button><i className='sc-icon-clear' /></button>
                        </li>
                        {this._getAdditionalModules(this.props.modules).map((moduleName) => {
                            return (
                                <li className='screeps-modules-view__item' key={moduleName}>
                                    <button onClick={() => this.onSelectModule(moduleName)}>{ moduleName }</button>
                                    <button><i className='sc-icon-clear' /></button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className='screeps-modules-view__new'>
                        <form>
                            <fieldset className='screeps-field'>
                                <input className='native-key-bindings' placeholder='New module name...' type='text' autoComplete='' required={ true } onChange={() => {}} />
                                <div className='underline' />
                            </fieldset>
                        </form>
                    </div>
                </div>
            );
        }

        return (
            <div className='screeps-ide screeps-modules-view'>
                { header }
                <hr className='screeps-hr' />
                { view }
            </div>
        );
    }

    private _getAdditionalModules = (modules: IModules) => {
        return Object.keys(modules).filter((item) => {
            return item !== 'main' && modules[item];
        });
    }
}

export default ModulesView;
