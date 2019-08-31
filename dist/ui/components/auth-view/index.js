"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
exports.default = react_1.forwardRef(function (props, ref) {
    const [state, setState] = react_1.useState({});
    const [email, setEmailValue] = react_1.useState('');
    const [password, setPassValue] = react_1.useState('');
    react_1.useImperativeHandle(ref, () => ({
        setState(state) {
            setState(state);
        }
    }));
    return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
        React.createElement("header", null,
            React.createElement("div", { className: 'logotype' }),
            React.createElement("button", { className: 'btn _cross', onClick: onCancel })),
        React.createElement("div", null, "Your credentials are only used to create an auth token, password will not be stored."),
        React.createElement("form", { onSubmit: onSubmit, className: ['--indented', state.isInvalid ? '--invalid' : ''].join(' ') },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'email', placeholder: ' ', value: email, onChange: onInputEmail, required: true, autoComplete: 'off', tabIndex: 1 }),
                React.createElement("label", null, "E-mail or username"),
                React.createElement("div", { className: 'underline' })),
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("input", { className: 'native-key-bindings', type: 'password', name: 'password', placeholder: ' ', value: password, onChange: onInputPass, required: true, autoComplete: 'off', tabIndex: 2 }),
                React.createElement("label", null, "Password"),
                React.createElement("div", { className: 'underline' })),
            React.createElement("div", { className: 'error' }, "Account credentials are invalid")),
        React.createElement("footer", null,
            React.createElement("div", null,
                React.createElement("a", { href: 'https://screeps.com/a/#!/register', target: '_blank', tabIndex: 3 }, "Create a new account"),
                React.createElement("a", { href: 'https://screeps.com/a/#!/register/ask-recover', target: '_blank', tabIndex: 4 }, "I forgot my password")),
            React.createElement("button", { className: 'btn btn--big btn--transparent', type: 'button', onClick: onCancel, tabIndex: 5 }, "Cancel"),
            React.createElement("button", { className: 'btn btn--big btn--primary', type: 'button', onClick: onSubmit, disabled: state.isBlocking || !email || !password, tabIndex: 6 }, "Sign In"))));
    function onInputEmail(event) {
        const target = event.target;
        const value = target.value;
        setEmailValue(value);
        setState({ isBlocking: false });
    }
    function onInputPass(event) {
        const target = event.target;
        const value = target.value;
        setPassValue(value);
        setState({ isBlocking: false });
    }
    function onCancel() {
        props.onCancel && props.onCancel();
    }
    function onSubmit() {
        setState({ isBlocking: true });
        props.onSubmit && props.onSubmit({
            email,
            password
        });
    }
});
//# sourceMappingURL=index.js.map