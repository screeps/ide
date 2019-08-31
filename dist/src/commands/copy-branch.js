"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const state_1 = require("../state");
const prompt_modal_1 = require("../components/prompt-modal");
async function copyBranch(branch) {
    let api;
    try {
        api = await utils_1.getApi();
        await utils_1.getUser();
    }
    catch (err) {
        throw err;
    }
    let newName;
    try {
        newName = await prompt_modal_1.default({
            legend: 'This branch will be cloned to the new branch. Please enter a new branch name:'
        });
        await api.cloneUserBranch({ branch, newName });
        const { list: branches } = await api.getUserBranches();
        state_1.default.next(Object.assign({}, state_1.default.getValue(), { branches }));
    }
    catch (err) {
        throw err;
    }
    return newName;
}
exports.copyBranch = copyBranch;
//# sourceMappingURL=copy-branch.js.map