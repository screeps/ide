"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const confirm_modal_1 = require("../confirm-modal");
const state_1 = require("../../state");
const utils_1 = require("../../utils");
const commands_1 = require("../../commands");
const branches_view_1 = require("../../../ui/components/branches-view");
function BranchesBlock({ branch, branches = [] }) {
    return (React.createElement(branches_view_1.default, { branch: branch, branches: branches, onCopyBranch: onCopyBranch, onSelectBranch: onSelectBranch, onDeleteBranch: onDeleteBranch, onSetActiveSim: onSetActiveSim, onSetActiveWorld: onSetActiveWorld }));
    async function onCopyBranch(branch) {
        console.log('BranchesBlock::onCopyBranch');
        try {
            await commands_1.copyBranch(branch);
        }
        catch (err) {
            // Noop.
        }
    }
    async function onSelectBranch(_branch) {
        console.log(2, 'BranchesBlock::onSelectBranch');
        try {
            const _api = await utils_1.getApi();
            const { branch, modules: _modules } = await _api.getUserCode(_branch);
            // по идее тут вообще никаких changes быть не может, можно просто сразу все выводить как есть
            const changes = await utils_1.readUserCode(utils_1.getBranchPath(branch));
            const files = Object.entries(changes)
                .reduce((acc, [name]) => (Object.assign({}, acc, { [name]: null })), {});
            const modules = utils_1.combineModules(Object.assign({}, files, _modules), changes);
            const state = state_1.default.getValue();
            state_1.default.next(Object.assign({}, state, { branch, modules: Object.assign({}, state.modules, { [branch]: modules }) }));
        }
        catch (err) {
            // Noop.
        }
    }
    async function onDeleteBranch(branch) {
        console.log('BranchesBlock::onDeleteBranch');
        try {
            await confirm_modal_1.default({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });
            const _api = await utils_1.getApi();
            await _api.deleteUserBranch(branch);
            const { list: branches } = await _api.getUserBranches();
            state_1.default.next(Object.assign({}, state_1.default.getValue(), { branches }));
        }
        catch (err) {
            // Noop.
        }
    }
    async function onSetActiveSim(_branch) {
        try {
            const _api = await utils_1.getApi();
            await _api.setActiveSim(_branch);
            const state = state_1.default.getValue();
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
            });
            state_1.default.next(Object.assign({}, state, { branches }));
            // ttps://screeps.com/api/user/set-active-branch
        }
        catch (err) {
            // Noop.
        }
    }
    async function onSetActiveWorld(_branch) {
        try {
            const _api = await utils_1.getApi();
            await _api.setActiveWorld(_branch);
            const state = state_1.default.getValue();
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
            });
            state_1.default.next(Object.assign({}, state, { branches }));
            // ttps://screeps.com/api/user/set-active-branch
        }
        catch (err) {
            // Noop.
        }
    }
}
exports.BranchesBlock = BranchesBlock;
//# sourceMappingURL=index.js.map