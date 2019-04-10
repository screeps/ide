import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BehaviorSubject } from 'rxjs';

import { BranchesView  } from '../../../ui';
import { getApi, getUser } from '../../utils';
import { copyBranch } from '../../commands';

export class ScreepsStatusBar {
    public element: HTMLElement = document.createElement('div');
    _tooltip: HTMLElement = document.createElement('div');

    public branchedVewRef = React.createRef<BranchesView>();

    constructor(
        private _state: BehaviorSubject<IState>
    ) {
        this.element.classList.add(
            'screeps-ide__status-bar',
            'screeps-ide__status-bar--screeps',
            'inline-block'
        );

        atom.tooltips.add(this.element, {
            item: this._tooltip,
            trigger: 'click',
            class: 'screeps-ide__tooltip'
        });

        this.render(_state.getValue());
    }

    render({ branch }: IState = { branch: '' }) {
        ReactDOM.render(
            <div onClick={() => this.tooltip()}>
                <b className='sc-icon-screeps'></b>
                <i>{ branch }</i>
            </div>,
            this.element
        )
    }

    tooltip() {
        (async () => {
            try {
                const _api = await getApi();
                await getUser();

                const { list: branches } = await _api.getUserBranches();

                const branch = this._state.getValue().branch;

                // TODO: check destroy instance of React.Component
                ReactDOM.render(
                    <BranchesView ref={ this.branchedVewRef }
                        branch={ branch }
                        branches={ branches }

                        onBranch={(...args) => this.onBranch(...args)}
                        onCopyBranch={(...args) => this.onCopyBranch(...args)}
                    />,
                    this._tooltip
                )
            } catch (err) {
            }
        })()
    }

    onBranch(branch: string) {
        if (!this.branchedVewRef.current) {
            return;
        }

        this.branchedVewRef.current.setState({
            ...this.branchedVewRef.current.state,
            branch
        });

        this._state.next({
            ...this._state.getValue(),
            branch
        });
    }

    async onCopyBranch(branch: string): Promise<void> {
        try {
            const newBranch = await copyBranch(branch)

            this.onBranch(newBranch);
        } catch(err) {
            console.error(err);
        }
    }
}
