"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
function default_1({ onInput }) {
    const [value, setValue] = react_1.useState('');
    return (React.createElement("div", { className: 'screeps-memory__input' },
        React.createElement("form", { onSubmit: onSubmit },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'Add new memory watch path here, e.g. "creeps.John"', autoComplete: '', onChange: onChange, value: value }),
                React.createElement("div", { className: 'underline' })))));
    function onChange(event) {
        const target = event.target;
        const value = target.value;
        setValue(value);
    }
    function onSubmit(event) {
        onInput && onInput(value);
        setValue('');
        event.preventDefault();
    }
}
exports.default = default_1;
//# sourceMappingURL=input.js.map