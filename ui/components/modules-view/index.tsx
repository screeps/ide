/// <reference path='./index.d.ts' />

import * as React from 'react';

class ModulesView extends React.Component<IModulesViewProps> {
    //@ts-ignore
    props: IModulesViewProps;

    state: IModulesViewState;

    constructor(props: IModulesViewProps) {
        super(props);

        this.state = {
            isProgressing: false,

            modules: props.modules,

            branch: props.branch,
            branches: props.branches,

            isShowingBranches: false
        }
    }

    public render() {
        let view;
        let header;

        if (this.state.isShowingBranches) {
            header = (
                <div className='screeps-modules-view__header'>
                    <span>Choose active branch:</span>
                </div>
            );

            view = (
                <ul className='tab-bar screeps-modules-view__items'>
                {this.state.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                    let deleteButton;
                    let sim;
                    let world;

                    if (!activeSim && !activeWorld) {
                        deleteButton = <div className='close-icon' onClick={() => this.onDeleteBranch(branch)}></div>;
                    }

                    if (activeWorld) {
                        world = <span className='screeps-modules-view__active'>world</span>;
                    }

                    if (activeSim) {
                        sim = <span className='screeps-modules-view__active'>sim</span>;
                    }


                    return (
                        <li className='tab screeps-modules-view__item' key={_id}>
                            <button className='btn btn--clear' onClick={() => this.onCopyBranch(branch)}><i className='sc-icon-copy' /></button>
                            <button className='btn btn--clear' onClick={() => this.onSelectBranch(branch)}>{ branch }</button>
                            { world } { sim }                          
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
                    <button className='btn btn--clear' onClick={() => this.onChooseBranches()}>{ this.state.branch }</button>
                </div>
            )

            view = (
                <div>
                    <ul className='tab-bar screeps-modules-view__items'>
                        <li className='tab screeps-modules-view__item'>
                            <button className='btn btn--clear' onClick={() => this.onSelectModule('main')}>main</button>
                        </li>
                        {this._getAdditionalModules(this.state.modules).map((moduleName) => {
                            return (
                                <li className='tab screeps-modules-view__item' key={moduleName}>
                                    <button className='btn btn--clear' onClick={() => this.onSelectModule(moduleName)}>{ moduleName }</button>
                                    <div className='close-icon'></div>
                                </li>
                            );
                        })}
                    </ul>
                    {/* <div className='screeps-modules-view__new'>
                        <form>
                            <fieldset className='screeps-field'>
                                <input className='native-key-bindings' placeholder='New module name...' type='text' autoComplete='' required={ true } onChange={() => {}} />
                                <div className='underline' />
                            </fieldset>
                        </form>
                    </div> */}
                </div>
            );
        }

        return (
            <div className='screeps-ide screeps-modules-view'>
                { header }
                <hr className={ 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') } />
                { view }
            </div>
        );
    }

    onChooseModules() {
        this.state.isShowingBranches = false;
        this.setState({ ...this.state });
        this.props.onChooseModules && this.props.onChooseModules();
    }

    onChooseBranches() {
        this.state.isShowingBranches = true;
        this.setState({ ...this.state });
        this.props.onChooseBranches && this.props.onChooseBranches();
    }

    onCopyBranch(branch: string) {
        this.props.onCopyBranch && this.props.onCopyBranch(branch);
    }

    onSelectBranch(branch: string) {
        this.state.isShowingBranches = false;
        this.state.modules = {};
        this.setState({ ...this.state, branch });
        this.props.onSelectBranch && this.props.onSelectBranch(branch);
    }

    onDeleteBranch(branch: string) {
        this.props.onDeleteBranch && this.props.onDeleteBranch(branch);
    }

    onSelectModule(module: string) {
        this.props.onSelectModule && this.props.onSelectModule(module);
    }

    private _getAdditionalModules = (modules: IModules) => {
        return Object.keys(modules).filter((item) => {
            return item !== 'main' && modules[item];
        });
    }
}

export default ModulesView;
