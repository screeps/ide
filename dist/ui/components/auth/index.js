"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
// import './style.css';
// @ts-ignore: 
// const vscode = acquireVsCodeApi();
// import { Subject } from 'rxjs';
exports.MODAL_CLOSE = 'MODAL_CLOSE';
class AuthModal extends React.Component {
    constructor(props) {
        // super(props);
        super(props);
        // public props: IAuthModalProps;
        // public onCancel: Function = () => {};
        this._data = {};
        this.onCancel = () => {
            console.log('onCancel');
            if (this.props.onCancel) {
                this.props.onCancel();
            }
            // window.addEventListener('message', event => {
            //     const message = event.data; // The JSON data our extension sent
            //     switch (message.command) {
            //         case 'refactor':
            //             count = Math.ceil(count * 0.5);
            //             counter.textContent = count;
            //             break;
            //     }
            // });
        };
        this.onSubmit = () => {
            console.log('onSubmit');
            if (this.props.onSubmit) {
                this.props.onSubmit(this._data);
            }
        };
        this.onInput = (event) => {
            const target = event.target;
            const name = target.name;
            const value = target.value;
            this._data[name] = value;
        };
        console.log(props, this);
        // this.onCancel = 
        // this.onChange = this.onChange.bind(this);
    }
    render() {
        return (React.createElement("div", { className: 'screeps-modal screeps-auth-modal' },
            React.createElement("header", null,
                React.createElement("div", { className: 'logotype' }),
                React.createElement("button", { className: 'btn _cross', onClick: this.onCancel })),
            React.createElement("form", null,
                React.createElement("fieldset", null,
                    React.createElement("input", { type: 'text', name: 'email', required: true, onChange: this.onInput, className: 'native-key-bindings' }),
                    React.createElement("label", null, "E-mail or username"),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("fieldset", null,
                    React.createElement("input", { type: 'password', name: 'password', required: true, onChange: this.onInput, className: 'native-key-bindings' }),
                    React.createElement("label", null, "Password"),
                    React.createElement("div", { className: 'underline' }))),
            React.createElement("footer", null,
                React.createElement("button", { className: 'btn btn--transparent', onClick: this.onCancel }, "Cancel"),
                React.createElement("button", { className: 'btn btn--primary', type: 'submit', onClick: this.onSubmit }, "Sign In"))));
    }
}
exports.default = AuthModal;
//# sourceMappingURL=index.js.map