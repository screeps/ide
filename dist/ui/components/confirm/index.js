"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
function default_1({ legend, submitBtn, onCancel: cancel, onSubmit: submit }) {
    legend = legend || 'Are you sure? Do you want execute it?';
    submitBtn = submitBtn || 'Ok';
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("form", { className: '--indented' },
            React.createElement("legend", null, legend)),
        React.createElement("footer", null,
            React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: onCancel }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: onSubmit }, submitBtn))));
    // Public component output actions.
    function onCancel() {
        cancel && cancel();
    }
    function onSubmit() {
        submit && submit();
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map