import * as React from 'react';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { default as __state } from '../../state';
import {
    getBranchPath, 
    readUserCode,
    getApi,
    combineModules
} from '../../utils';

import BranchesView from '../../../ui/components/branches-view';

export function BranchesBlock({ branch, branches = [] }: any) {
    return (
        <BranchesView
            branch={ branch }
            branches={ branches }

            onCopyBranch={ onCopyBranch }
            onSelectBranch={ onSelectBranch }
            onDeleteBranch={ onDeleteBranch }

            onSetActiveSim={ onSetActiveSim }
            onSetActiveWorld={ onSetActiveWorld }
        />
    );

    async function onCopyBranch(branch: string): Promise<void> {
        console.log('BranchesBlock::onCopyBranch');

        try {
            let api;
            try {
                api = await getApi();
            } catch (err) {
                throw err;
            }
        
            let newName;
            try {
                newName = await prompt({
                    legend: 'This branch will be cloned to the new branch. Please enter a new branch name:'
                });
        
                await api.cloneUserBranch({ branch, newName });
        
                const { list: branches } = await api.getUserBranches();
        
                __state.next({
                    ...__state.getValue(),
                    branches
                });
            } catch(err) {
                throw err;
            }
        } catch(err) {
            // Noop.
        }
    }

    async function onSelectBranch(_branch: string): Promise<void> {
        console.log(2, 'BranchesBlock::onSelectBranch');

        try {
            const _api = await getApi();
            const { branch, modules: _modules } = await _api.getUserCode(_branch);

            // по идее тут вообще никаких changes быть не может, можно просто сразу все выводить как есть
            const changes = await readUserCode(getBranchPath(branch));

            const files = Object.entries(changes)
                .reduce((acc, [name]) => ({ ...acc, [name]: null }), {});

            const modules = combineModules({
                ...files,
                ..._modules
            }, changes);

            const state = __state.getValue();

            __state.next({
                ...state,
                branch,
                modules: {
                    ...state.modules,
                    [branch]: modules
                }
            });
        } catch(err) {
            // Noop.
        }
    }

    async function onDeleteBranch(branch: string): Promise<void> {
        console.log('BranchesBlock::onDeleteBranch');

        try {
            await confirm({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });

            const _api = await getApi();
            await _api.deleteUserBranch(branch);
            const { list: branches } = await _api.getUserBranches();

            __state.next({
                ...__state.getValue(),
                branches
            });
        } catch(err) {
            // Noop.
        }
    }

    async function onSetActiveSim(_branch: string): Promise<void> {
        try {
            const _api = await getApi();

            await _api.setActiveSim(_branch);

            const state = __state.getValue();
            let { branches } = state;

            if (!branches) {
                return;
            }

            branches = branches.map((data) => {
                const { branch } = data;
                data.activeSim = false;
                if (branch === _branch) {
                    data.activeSim = true;
                }

                return data;
            })

            __state.next({
                ...state,
                branches
            })
            // ttps://screeps.com/api/user/set-active-branch
        } catch(err) {
            // Noop.
        }
    }

    async function onSetActiveWorld(_branch: string): Promise<void> {
        try {
            const _api = await getApi();

            await _api.setActiveWorld(_branch);

            const state = __state.getValue();
            let { branches } = state;

            if (!branches) {
                return;
            }

            branches = branches.map((data) => {
                const { branch } = data;
                data.activeWorld = false;
                if (branch === _branch) {
                    data.activeWorld = true;
                }

                return data;
            })

            __state.next({
                ...state,
                branches
            })
            // ttps://screeps.com/api/user/set-active-branch
        } catch(err) {
            // Noop.
        }
    }

}
