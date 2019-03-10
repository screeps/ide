"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MemoryInputView extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPressHandler = (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!event.target.value) {
                return;
            }
            this.props.onInput && this.props.onInput(event.target.value);
            event.target.value = '';
        };
        this.onSubmit = (event) => {
            event.preventDefault();
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__input' },
            React.createElement("form", { onSubmit: this.onSubmit },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'Add new memory watch path here, e.g. "creeps.Jhon"', autoComplete: '', onKeyPress: this.onKeyPressHandler }),
                    React.createElement("div", { className: 'underline' })))));
    }
}
exports.default = MemoryInputView;
//# sourceMappingURL=input.js.map