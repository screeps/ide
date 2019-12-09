const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { useState, useEffect } from 'react';

import { default as prompt } from '../prompt-modal';
import { default as confirm } from '../confirm-modal';
import { default as __state } from '../../state';
import {
    getBranchPath,
    readUserCode,
    getApi,
    combineModules,
    createScreepsTernConfig
} from '../../utils';

import {
    BranchesView
} from '../../../ui';

let progressStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

type BranchesBlockProps = {
    branch: string;
    branches: IBranch[];
    active?: string;
}

export function BranchesBlock(props: BranchesBlockProps) {
    const [inProgress, setInProgress] = useState(false);
    const [progress, setProgress] = useState(false);
    const [branch, setBranch] = useState(props.branch);

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

    useEffect(() => {
        if (!branch) {
            const _branch = props.branches.find(({ activeWorld }) => activeWorld);
            _branch && onSelectBranch(_branch.branch);
            _branch && setBranch(_branch.branch);

            return;
        }
    }, [branch]);

    return (
        <BranchesView
            isProgressing={ inProgress }

            active={ props.active }
            branches={ props.branches }

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
            const _branches: IBranch[] = props.branches;
            try {
                newName = await prompt({
                    legend: 'This branch will be cloned to the new branch. Please enter a new branch name:',
                    onInput: (newBranch: string) => {
                        const isExist = _branches.some(({ branch }) => branch === newBranch);
                        if (!isExist) {
                            return;
                        }

                        return {
                            warning: 'A branch with this name already exists and will be overwritten!'
                        };
                    }
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

            const branchPath = getBranchPath(branch);
            try {
                await createScreepsTernConfig(branchPath);
            } catch(err) {
            }

            // по идее тут вообще никаких changes быть не может, можно просто сразу все выводить как есть
            const changes = await readUserCode(branchPath);

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
                const _branch = branches.find(({ activeWorld }) => activeWorld);
                _branch && onSelectBranch(_branch.branch);
            }

            const branchPath = getBranchPath(branch);
            try {
                fs.rmdirSync(branchPath);
            } catch(err) {
                const files = fs.readdirSync(branchPath);
                files.forEach((modulePath: string) => {
                    try {
                        fs.unlinkSync(path.resolve(branchPath, modulePath));
                    } catch(err) {
                        // Noop.
                    }
                });

                try {
                    fs.rmdirSync(branchPath);
                } catch(err) {
                    // Noop.
                }
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
