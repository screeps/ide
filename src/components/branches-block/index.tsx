import * as React from 'react';
import { useState, useEffect } from 'react';

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

let progressStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

export function BranchesBlock({ branch, branches = [] }: any) {
    const [inProgress, setInProgress] = useState(false);
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        const now = new Date() .getTime();

        if (progress) {
            progressStartTime = now;
            setInProgress(true);

            return;
        }

        const delay = ANIMATION_MIN_TIME - (now - progressStartTime);

        setTimeout(() => setInProgress(false), delay > 0 ? delay : 0);
    }, [progress]);

    return (
        <BranchesView
            isProgressing={ inProgress }

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
        setProgress(true);

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

        setProgress(false);
    }

    async function onSelectBranch(_branch: string): Promise<void> {
        setProgress(true);

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

        setProgress(false);
    }

    async function onDeleteBranch(branch: string): Promise<void> {
        setProgress(true);

        try {
            await confirm({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });

            const _api = await getApi();
            await _api.deleteUserBranch(branch);
            const { list: branches } = await _api.getUserBranches();

            const state = __state.getValue();

            __state.next({
                ...state,
                branches
            });

            let { branch: currentBranch } = state;

            if (branch === currentBranch) {
                const ibranch = branches.find(({ activeWorld }) => activeWorld);
                ibranch && onSelectBranch(ibranch.branch);
            }
        } catch(err) {
            // Noop.
        }

        setProgress(false);
    }

    async function onSetActiveSim(_branch: string): Promise<void> {
        setProgress(true);

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
        } catch(err) {
            // Noop.
        }

        setProgress(false);
    }

    async function onSetActiveWorld(_branch: string): Promise<void> {
        setProgress(true);

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
        } catch(err) {
            // Noop.
        }

        setProgress(false);
    }

}
