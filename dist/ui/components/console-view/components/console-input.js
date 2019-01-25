"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ConsoleInputView extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPressHandler = (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!event.target.value) {
                return;
            }
            this.props.onInput && this.props.onInput({ expression: event.target.value });
            event.target.value = '';
        };
        this.onSubmit = (event) => {
            event.preventDefault();
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-console__input' },
            React.createElement("form", { onSubmit: this.onSubmit },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'Command...', autoComplete: '', onKeyPress: this.onKeyPressHandler }),
                    React.createElement("div", { className: 'underline' })))));
    }
}
exports.default = ConsoleInputView;
//# sourceMappingURL=console-input.js.map