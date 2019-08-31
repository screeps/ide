"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as React from 'react';
const React = require("react");
const react_1 = require("react");
exports.default = react_1.forwardRef(function (props, ref) {
    const [valid, setValid] = react_1.useState(false);
    const [branch, setBranch] = react_1.useState(props.branch);
    const [branches, setBranches] = react_1.useState(props.branches || []);
    const [projectPath, setProjectPathValue] = react_1.useState(props.projectPath || '');
    const [projectPathLabel] = react_1.useState(props.projectPathLabel || 'Please enter a new project folder path');
    const [projectPathReadonly] = react_1.useState(props.projectPathReadonly || false);
    const [download, setDownloadValue] = react_1.useState(true);
    const [downloadReadonly] = react_1.useState(props.downloadReadonly || false);
    const [submitBtn] = react_1.useState(props.submitBtn || 'Create');
    react_1.useImperativeHandle(ref, () => ({
        setProjectPathValue(path) {
            setProjectPathValue(path);
        },
        setBranches(_) {
            setBranches(_);
        }
    }));
    react_1.useEffect(() => {
        let valid = false;
        if (branch && projectPath) {
            valid = true;
        }
        setValid(valid);
    }, [branch, projectPath]);
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-create-project' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("form", { className: '--indented' },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null,
                    projectPathLabel,
                    ":"),
                React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'project-path', value: projectPath, onChange: onInput, onClick: props.onClick, required: true, readOnly: projectPathReadonly, autoFocus: true, tabIndex: 1 }),
                React.createElement("div", { className: 'underline' })),
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null, "Select branch:"),
                React.createElement("select", { className: 'native-key-bindings input-select', name: 'branch-name', value: branch, onChange: (event) => onBranch(event), required: true, tabIndex: 2 },
                    !branch && (React.createElement("option", { value: branch })),
                    branches.map(({ _id, branch }) => {
                        return (React.createElement("option", { key: _id, value: branch }, branch));
                    }))),
            React.createElement("fieldset", { className: 'screeps-field', style: { marginBottom: 0 } },
                React.createElement("legend", null, "Select language:"),
                React.createElement("label", null,
                    React.createElement("input", { className: 'native-key-bindings input-radio', type: 'radio', name: 'javascript', checked: true, onChange: () => { }, tabIndex: 3 }),
                    React.createElement("span", null, "JavaScript \u2014 Native language for Screeps, no requirements")),
                React.createElement("label", null,
                    React.createElement("input", { className: 'native-key-bindings input-radio', type: 'radio', name: 'typescript', checked: false, onChange: () => { }, disabled: true, tabIndex: 4 }),
                    React.createElement("span", null,
                        "TypeScript \u2014 Advanced language with types support, requires TypeScript compilator package to run. ",
                        React.createElement("em", null, "(UNDER DEVELOPMENT)")))),
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("label", null,
                    React.createElement("input", { className: 'native-key-bindings input-checkbox', type: 'checkbox', name: 'download', checked: download, onChange: () => !downloadReadonly && setDownloadValue(!download), readOnly: downloadReadonly, tabIndex: 5 }),
                    "Fetch to this folder now"))),
        React.createElement("footer", null,
            React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: onCancel, tabIndex: 6 }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', disabled: !valid, onClick: onSubmit, tabIndex: 7 }, submitBtn))));
    // Private component actions.
    function onInput(event) {
        const target = event.target;
        const value = target.value;
        setProjectPathValue(value);
    }
    function onBranch(event) {
        const target = event.target;
        const value = target.value;
        setBranch(value);
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
});
//# sourceMappingURL=index.js.map