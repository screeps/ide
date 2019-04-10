/// <reference path='./index.d.ts' />

import * as React from 'react';

const DEFAULT_BRANCH = 'default';
const VIEW_SELECT = 'SELECT';
const VIEW_CREATE = 'CREATE';

export default class BranchesView extends React.Component<IBranchesViewProps> {
    //@ts-ignore
    props: IBranchesViewProps;
    state: IBranchesViewState;

    _inputRef = React.createRef();

    constructor(props: IBranchesViewProps) {
        super(props);

        this.state = {
            branch: props.branch || DEFAULT_BRANCH,
            view: VIEW_SELECT
        }
    }

    public render() {
        let control;

        if (this.state.view === VIEW_SELECT) {
            control = (<select className='input-select'
                value={ this.state.branch }

                onChange={(event) => this.onBranch(event)}
            >
                { this.props.branches.map(({ _id, branch }) => {
                    return (<option key={ _id } value={ branch }>{ branch }</option>);
                })}
            </select>);
        } else {
            control = (
                // @ts-ignore
                <atom-text-editor mini ref={ this._inputRef }></atom-text-editor>
            );
        }

        return (
            <div className='screeps-ide screeps-branches-view'>
                <i className='sc-icon-screeps' />
                { control }
                <button className='btn'
                    onClick={() => this.newBranch()}
                >
                    New Branch
                </button>
            </div>
        )
    }

    public newBranch() {
        if (this.state.view === VIEW_SELECT) {
            this.state.view = VIEW_CREATE;
            this.setState({ ...this.state });

            return;
        }

        // @ts-ignore
        console.log(this._inputRef.current.getModel().getText());
    }

    public onBranch(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onBranch && this.props.onBranch(event.target.value);
    }
}
