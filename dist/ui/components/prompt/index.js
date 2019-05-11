"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MODAL_CLOSE = 'MODAL_CLOSE';
class PromptModal extends React.Component {
    constructor(props) {
        super(props);
        this.message = '';
        // Private component actions.
        this.onInput = (event) => {
            const target = event.target;
            this.message = target.value;
        };
        // Public component output actions.
        this.onCancel = () => {
            this.props.onCancel && this.props.onCancel();
        };
        this.onSubmit = () => {
            this.setState({});
            this.props.onSubmit && this.props.onSubmit(this.message);
        };
        this.state = {
            legend: props.legend || 'Are you sure? Do you want execute it?',
            submitBtn: props.submitBtn || 'Ok'
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-modal screeps-auth-modal' },
            React.createElement("header", null,
                React.createElement("div", { className: 'logotype' }),
                React.createElement("button", { className: 'btn _cross', onClick: this.onCancel })),
            React.createElement("form", null,
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("legend", null, this.state.legend),
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', name: 'message', onChange: this.onInput, required: true, autoFocus: true }),
                    React.createElement("div", { className: 'underline' }))),
            React.createElement("footer", null,
                React.createElement("button", { className: 'btn btn--big btn--transparent', onClick: this.onCancel }, "Cancel"),
                React.createElement("button", { className: 'btn btn--big btn--primary', type: 'submit', onClick: this.onSubmit }, this.state.submitBtn))));
    }
}
exports.default = PromptModal;
//# sourceMappingURL=index.js.map