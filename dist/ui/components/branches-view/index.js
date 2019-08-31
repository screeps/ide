"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.BTN_CLONE = 'screeps-branches__item-clone-';
exports.BTN_DELETE = 'screeps-branches__item-delete-';
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-ide screeps-branches-view' },
        React.createElement("div", { className: 'screeps-branches-view__header' },
            React.createElement("span", null, "Branches")),
        React.createElement("hr", { className: 'screeps-hr' + (props.isProgressing ? ' screeps-hr--inprogress' : '') }),
        React.createElement("div", { className: 'screeps-branches-view__items' },
            React.createElement("ul", { className: 'tab-bar' }, props.branches && props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                let deleteButton;
                let sim;
                let world;
                if (!activeSim && !activeWorld) {
                    deleteButton = React.createElement("div", { id: `${exports.BTN_DELETE}-${_id}`, className: 'close-icon', onClick: () => onDeleteBranch(branch) });
                }
                if (activeWorld) {
                    world = (React.createElement("button", { className: 'screeps-branches-view__world --active' }, "world"));
                }
                else {
                    world = (React.createElement("button", { className: 'screeps-branches-view__world', onClick: () => onSetActiveWorld(branch) }, "world"));
                }
                if (activeSim) {
                    sim = (React.createElement("button", { className: 'screeps-branches-view__sim --active' }, "sim"));
                }
                else {
                    sim = (React.createElement("button", { className: 'screeps-branches-view__sim', onClick: () => onSetActiveSim(branch) }, "sim"));
                }
                return (React.createElement("li", { className: 'tab screeps-branches-view__item' + (props.active === branch ? ' --active' : ''), key: _id },
                    React.createElement("button", { id: `${exports.BTN_CLONE}-${_id}`, className: 'btn', onClick: () => onCopyBranch(branch), style: { display: "none" } },
                        React.createElement("i", { className: 'sc-icon-copy' })),
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => onSelectBranch(branch) }, branch),
                    world,
                    " ",
                    sim,
                    deleteButton));
            })))));
    function onCopyBranch(branch) {
        return props.onCopyBranch && props.onCopyBranch(branch);
    }
    function onSelectBranch(branch) {
        return props.onSelectBranch && props.onSelectBranch(branch);
    }
    function onDeleteBranch(branch) {
        return props.onDeleteBranch && props.onDeleteBranch(branch);
    }
    function onSetActiveSim(branch) {
        return props.onSetActiveSim && props.onSetActiveSim(branch);
    }
    function onSetActiveWorld(branch) {
        return props.onSetActiveWorld && props.onSetActiveWorld(branch);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map