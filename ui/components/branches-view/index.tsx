/// <reference path='./index.d.ts' />

import * as React from 'react';

const DEFAULT_BRANCH = 'default';

export default class BranchesView extends React.Component<IBranchesViewProps> {
    //@ts-ignore
    props: IBranchesViewProps;
    state: IBranchesViewState;

    constructor(props: IBranchesViewProps) {
        super(props);

        this.state = {
            branch: props.branch || DEFAULT_BRANCH
        }
    }

    public render() {
        return (
            <div className='screeps-ide screeps-branches-view'>
                <i className='sc-icon-screeps' />
                <select className='input-select'
                    value={ this.state.branch }

                    onChange={(event) => this.onBranch(event)}
                >
                    { this.props.branches.map(({ _id, branch }) => {
                        return (<option key={ _id } value={ branch }>{ branch }</option>);
                    })}
                </select>
                <button className='btn'>
                    New Branch
                </button>
            </div>
        )
    }

    public onBranch(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onBranch && this.props.onBranch(event.target.value);
    }
}
