"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
function default_1({ legend, submitBtn, onInput: input, onCancel: cancel, onSubmit: submit }) {
    const [message, setMessage] = react_1.useState('');
    const [warning, setWarning] = react_1.useState('');
    legend = legend || 'Are you sure? Do you want execute it?';
    submitBtn = submitBtn || 'Ok';
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("form", { className: ['--indented', warning ? '--warning' : ''].join(' '), onSubmit: onSubmit },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null, legend),
                React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'message', onChange: onInput, required: true, autoFocus: true, tabIndex: 1 }),
                React.createElement("div", { className: 'underline' })),
            React.createElement("div", { className: 'warning' }, warning)),
        React.createElement("footer", null,
            React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: onCancel, tabIndex: 2 }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', disabled: !message, onClick: onSubmit, tabIndex: 3 }, submitBtn))));
    // Private component actions.
    function onInput(event) {
        const target = event.target;
        setMessage(target.value);
        try {
            const { warning } = (input && input(target.value));
            setWarning(warning);
        }
        catch (err) {
            setWarning('');
        }
    }
    // Public component output actions.
    function onCancel() {
        cancel && cancel();
    }
    function onSubmit() {
        submit && submit(message);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map