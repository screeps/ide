"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as React from 'react';
const React = require("react");
const react_1 = require("react");
function default_1(props) {
    const [branch, setBranchValue] = react_1.useState(props.branch);
    const [projectPath, setProjectPathValue] = react_1.useState(props.projectPath || '');
    const [projectPathLabel] = react_1.useState(props.projectPathLabel || 'Please enter a new project folder path');
    const [projectPathReadonly] = react_1.useState(props.projectPathReadonly || false);
    const [download, setDownloadValue] = react_1.useState(true);
    const [downloadReadonly] = react_1.useState(props.downloadReadonly || false);
    const [submitBtn] = react_1.useState(props.submitBtn || 'Create');
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-create-project' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("form", { className: '--indented' },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null,
                    projectPathLabel,
                    ":"),
                React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'project-path', value: projectPath, onChange: onInput, required: true, readOnly: projectPathReadonly, autoFocus: true, tabIndex: 1 }),
                React.createElement("div", { className: 'underline' })),
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null, "Select branch"),
                React.createElement("select", { className: 'native-key-bindings input-select', name: 'branch-name', value: branch, onChange: (event) => onBranch(event), tabIndex: 2 }, props.branches.map(({ _id, branch }) => {
                    return (React.createElement("option", { key: _id, value: branch }, branch));
                }))),
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("label", null,
                    React.createElement("input", { className: 'native-key-bindings input-checkbox', type: 'checkbox', name: 'download', checked: download, onChange: () => !downloadReadonly && setDownloadValue(!download), readOnly: downloadReadonly, tabIndex: 3 }),
                    "Download modules from screeps to this folder"))),
        React.createElement("footer", null,
            React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: onCancel, tabIndex: 4 }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', disabled: !projectPath, onClick: onSubmit, tabIndex: 5 }, submitBtn))));
    // Private component actions.
    function onInput(event) {
        const target = event.target;
        const value = target.value;
        setProjectPathValue(value);
    }
    function onBranch(event) {
        const target = event.target;
        const value = target.value;
        setBranchValue(value);
    }
    // Public component output actions.
    function onCancel() {
        props.onCancel && props.onCancel();
    }
    function onSubmit() {
        props.onSubmit && props.onSubmit({
            projectPath,
            download,
            branch
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map