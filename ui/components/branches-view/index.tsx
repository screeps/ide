/// <reference path='./index.d.ts' />

import * as React from 'react';

export default class BranchesView extends React.Component<IBranchesViewProps> {
    //@ts-ignore
    props: IBranchesViewProps;

    constructor(props: IBranchesViewProps) {
        // console.log('BranchesView::constructor', '');

        super(props);
    }

    public render() {
        // console.log('BranchesView::render', '');

        return (
            <div className='screeps-ide screeps-branches-view'>
                <div className='screeps-branches-view__header'>
                    <span>Branches</span>
                </div>
                <hr className='screeps-hr' />
                <ul className='tab-bar screeps-branches-view__items'>
                {this.props.branches && this.props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                    let deleteButton;
                    let sim;
                    let world;

                    if (!activeSim && !activeWorld) {
                        deleteButton = <div className='close-icon' onClick={() => this.onDeleteBranch(branch)}></div>;
                    }

                    if (activeWorld) {
                        world = (<button className='screeps-branches-view__world --active'>
                            world
                        </button>);
                    } else {
                        world = (<button className='screeps-branches-view__world'
                            onClick={() => this.onSetActiveWorld(branch)}>
                            world
                        </button>);
                    }

                    if (activeSim) {
                        sim = (<button className='screeps-branches-view__sim --active'>
                            sim
                        </button>);
                    } else {
                        sim = (<button className='screeps-branches-view__sim'
                            onClick={() => this.onSetActiveSim(branch)}>
                            sim
                        </button>);
                    }

                    return (
                        <li className='tab screeps-branches-view__item' key={_id}>
                            <button className='btn btn--clear' onClick={() => this.onCopyBranch(branch)}><i className='sc-icon-copy' /></button>
                            <button className='btn btn--clear' onClick={() => this.onSelectBranch(branch)}>{ branch }</button>
                            { world } { sim }
                            { deleteButton }
                        </li>
                    )
                })}
                </ul>
            </div>
        );
    }

    onCopyBranch(branch: string) {
        this.props.onCopyBranch && this.props.onCopyBranch(branch);
    }

    onSelectBranch(branch: string) {
        this.props.onSelectBranch && this.props.onSelectBranch(branch);
    }

    onDeleteBranch(branch: string) {
        this.props.onDeleteBranch && this.props.onDeleteBranch(branch);
    }

    onSetActiveSim(branch: string) {
        this.props.onSetActiveSim && this.props.onSetActiveSim(branch);
    }

    onSetActiveWorld(branch: string) {
        this.props.onSetActiveWorld && this.props.onSetActiveWorld(branch);
    }
}
