import * as React from 'react';

import { default as confirm } from '../confirm-modal';
import { default as __state } from '../../state';
import {
    getBranchPath, 
    readUserCode,
    getApi,
    combineModules
} from '../../utils';
import { copyBranch } from '../../commands';

import BranchesView from '../../../ui/components/branches-view';

export function BranchesBlock({ branch, branches = [] }: any) {
    return (
        <BranchesView
            branch={ branch }
            branches={ branches }

            onCopyBranch={ onCopyBranch }
            onSelectBranch={ onSelectBranch }
            onDeleteBranch={ onDeleteBranch }
        />
    );

    async function onCopyBranch(branch: string): Promise<void> {
        console.log('BranchesBlock::onCopyBranch');

        try {
            await copyBranch(branch);
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

            __state.next({
                ...__state.getValue(),
                branch,
                modules
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

}
