"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
class TokenModal extends React.Component {
    constructor(props) {
        super(props);
        // Public component output actions.
        this.onCancel = () => {
            this.props.onCancel && this.props.onCancel();
        };
        this.onSubmit = () => {
            this.props.onSubmit && this.props.onSubmit();
        };
        this.state = {};
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
            React.createElement("header", null,
                React.createElement("div", { className: 'logotype' }),
                React.createElement("button", { className: 'btn _cross', onClick: this.onCancel })),
            React.createElement("form", null,
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("legend", null, "It'll be save to global config"),
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'email', disabled: true, required: true, value: this.props.token }),
                    React.createElement("div", { className: 'underline' }))),
            React.createElement("footer", null,
                React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: this.onCancel }, "Cancel"),
                React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: this.onSubmit }, "Ok"))));
    }
}
exports.default = TokenModal;
//# sourceMappingURL=index.js.map