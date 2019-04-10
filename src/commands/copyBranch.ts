import {
    getApi, getUser,
} from '../utils';

import { default as __state } from '../state';

import { default as prompt } from '../components/prompt-modal';

export async function copyBranch(branch: string) {
    let api;
    try {
        api = await getApi();
        await getUser();
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

    return newName;
}