"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
// @ts-ignore
function validate(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        let result;
        try {
            result = await original.apply(this, args);
        }
        catch (err) {
            // Noop.
        }
        let isBlocking = true;
        if (this._data.email && this._data.password) {
            isBlocking = false;
        }
        this.setState(Object.assign({}, this.state, { isInvalid: false, isBlocking }));
        return result;
    };
    return descriptor;
}
exports.validate = validate;
class AuthView extends React.Component {
    constructor(props) {
        super(props);
        this._data = {};
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
            isInvalid: false,
            isBlocking: true
        };
        this._emailRef = React.createRef();
        this._passwordRef = React.createRef();
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
            React.createElement("header", null,
                React.createElement("div", { className: 'logotype' }),
                React.createElement("button", { className: 'btn _cross', onClick: this.onCancel })),
            React.createElement("form", { className: ['--indented', this.state.isInvalid ? '--invalid' : ''].join(' ') },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { ref: this._emailRef, className: 'native-key-bindings', type: 'text', name: 'email', placeholder: ' ', onChange: (event) => this.onInput(event), required: true, autoComplete: 'off', tabIndex: 1 }),
                    React.createElement("label", null, "E-mail or username"),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { ref: this._passwordRef, className: 'native-key-bindings', type: 'password', name: 'password', placeholder: ' ', onChange: (event) => this.onInput(event), required: true, autoComplete: 'off', tabIndex: 2 }),
                    React.createElement("label", null, "Password"),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("div", { className: 'error' }, "Account credentials are invalid")),
            React.createElement("footer", null,
                React.createElement("div", null,
                    React.createElement("a", { href: 'https://screeps.com/a/#!/register', target: '_blank' }, "Create a new account"),
                    React.createElement("a", { href: 'https://screeps.com/a/#!/register/ask-recover', target: '_blank' }, "I forgot my password")),
                React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: this.onCancel, tabIndex: 3 }, "Cancel"),
                React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: this.onSubmit, disabled: this.state.isBlocking, tabIndex: 4 }, "Sign In"))));
    }
    // Private component actions.
    async onInput(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        // @ts-ignore
        this._data[name] = value;
    }
}
tslib_1.__decorate([
    validate
], AuthView.prototype, "onInput", null);
exports.default = AuthView;
//# sourceMappingURL=index.js.map