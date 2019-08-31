"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("form", { className: '--indented', onSubmit: onSubmit },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("legend", null, "This auth token will be saved to your preferences:"),
                React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'email', required: true, readOnly: true, value: props.token.substr(0, 8) + '-****-****-****-************' }),
                React.createElement("div", { className: 'underline' }))),
        React.createElement("footer", null,
            React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: onCancel, type: 'button' }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: onSubmit }, "Ok"))));
    // Public component output actions.
    function onCancel() {
        props.onCancel && props.onCancel();
    }
    function onSubmit() {
        props.onSubmit && props.onSubmit();
    }
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map