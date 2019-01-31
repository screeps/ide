"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
class AuthModal extends React.Component {
    constructor(props) {
        super(props);
        this._data = {};
        // Private component actions.
        this.onInput = (event) => {
            const target = event.target;
            const name = target.name;
            const value = target.value;
            this._data[name] = value;
        };
        // Public component output actions.
        this.onCancel = () => {
            this.props.onCancel && this.props.onCancel();
        };
        this.onSubmit = () => {
            this.setState({
                isBlocking: true
            });
            this.props.onSubmit && this.props.onSubmit(this._data);
        };
        this.state = {
            isBlocking: false
        };
        this._emailRef = React.createRef();
        this._passwordRef = React.createRef();
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
            React.createElement("header", null,
                React.createElement("div", { className: 'logotype' }),
                React.createElement("button", { className: 'btn _cross', onClick: this.onCancel })),
            React.createElement("form", null,
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { ref: this._emailRef, className: 'native-key-bindings', type: 'text', name: 'email', onChange: this.onInput, disabled: this.state.isBlocking, required: true }),
                    React.createElement("label", null, "E-mail or username"),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { ref: this._passwordRef, className: 'native-key-bindings', type: 'password', name: 'password', onChange: this.onInput, disabled: this.state.isBlocking, required: true }),
                    React.createElement("label", null, "Password"),
                    React.createElement("div", { className: 'underline' }))),
            React.createElement("footer", null,
                React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: this.onCancel }, "Cancel"),
                React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: this.onSubmit, disabled: this.state.isBlocking }, "Sign In"))));
    }
}
exports.default = AuthModal;
//# sourceMappingURL=index.js.map