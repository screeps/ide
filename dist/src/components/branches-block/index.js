"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const atom_1 = require("atom");
const React = require("react");
const react_1 = require("react");
const prompt_modal_1 = require("../prompt-modal");
const confirm_modal_1 = require("../confirm-modal");
const state_1 = require("../../state");
const utils_1 = require("../../utils");
const ui_1 = require("../../../ui");
let progressStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
let subscriptions = new atom_1.CompositeDisposable();
function BranchesBlock({ branch, branches = [], active }) {
    const [inProgress, setInProgress] = react_1.useState(false);
    const [progress, setProgress] = react_1.useState(false);
    react_1.useEffect(() => {
        const now = new Date().getTime();
        if (progress) {
            progressStartTime = now;
            setInProgress(true);
            return;
        }
        const delay = ANIMATION_MIN_TIME - (now - progressStartTime);
        setTimeout(() => setInProgress(false), delay > 0 ? delay : 0);
    }, [progress]);
    react_1.useEffect(() => {
        setTimeout(() => {
            subscriptions.dispose();
            subscriptions = new atom_1.CompositeDisposable();
            for (let { _id } of branches) {
                let d;
                d = utils_1.applyTooltip(`#${ui_1.BTN_BRANCHES_CLONE}-${_id}`, 'Clone branch');
                d && subscriptions.add(d);
                d = utils_1.applyTooltip(`#${ui_1.BTN_BRANCHES_DELETE}-${_id}`, 'Delete branch');
                d && subscriptions.add(d);
            }
        });
    }, [branches]);
    return (React.createElement(ui_1.BranchesView, { isProgressing: inProgress, branch: branch, branches: branches, active: active, onCopyBranch: onCopyBranch, onSelectBranch: onSelectBranch, onDeleteBranch: onDeleteBranch, onSetActiveSim: onSetActiveSim, onSetActiveWorld: onSetActiveWorld }));
    async function onCopyBranch(branch) {
        setProgress(true);
        try {
            let api;
            try {
                api = await utils_1.getApi();
            }
            catch (err) {
                throw err;
            }
            let newName;
            const _branches = branches;
            try {
                newName = await prompt_modal_1.default({
                    legend: 'This branch will be cloned to the new branch. Please enter a new branch name:',
                    onInput: (newBranch) => {
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
                state_1.default.next(Object.assign({}, state_1.default.getValue(), { branches }));
            }
            catch (err) {
                throw err;
            }
        }
        catch (err) {
            // Noop.
        }
        setProgress(false);
    }
    async function onSelectBranch(_branch) {
        setProgress(true);
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
        setProgress(false);
    }
    async function onDeleteBranch(branch) {
        setProgress(true);
        try {
            await confirm_modal_1.default({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });
            const _api = await utils_1.getApi();
            await _api.deleteUserBranch(branch);
            const { list: branches } = await _api.getUserBranches();
            const state = state_1.default.getValue();
            state_1.default.next(Object.assign({}, state, { branches }));
            let { branch: currentBranch } = state;
            if (branch === currentBranch) {
                const ibranch = branches.find(({ activeWorld }) => activeWorld);
                ibranch && onSelectBranch(ibranch.branch);
            }
            const branchPath = utils_1.getBranchPath(branch);
            try {
                fs.rmdirSync(branchPath);
            }
            catch (err) {
                const files = fs.readdirSync(branchPath);
                files.forEach((modulePath) => {
                    try {
                        fs.unlinkSync(path.resolve(branchPath, modulePath));
                    }
                    catch (err) {
                        // Noop.
                    }
                });
                try {
                    fs.rmdirSync(branchPath);
                }
                catch (err) {
                    // Noop.
                }
            }
        }
        catch (err) {
            // Noop.
        }
        setProgress(false);
    }
    async function onSetActiveSim(_branch) {
        setProgress(true);
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
        }
        catch (err) {
            // Noop.
        }
        setProgress(false);
    }
    async function onSetActiveWorld(_branch) {
        setProgress(true);
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
        }
        catch (err) {
            // Noop.
        }
        setProgress(false);
    }
}
exports.BranchesBlock = BranchesBlock;
//# sourceMappingURL=index.js.map