"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__segment' },
        React.createElement("textarea", { className: 'native-key-bindings', placeholder: 'NO DATA', value: props.segment, onChange: onChange, tabIndex: 7 })));
    function onChange(event) {
        props.onChange && props.onChange(event.target.value);
    }
}
exports.default = default_1;
//# sourceMappingURL=segment.js.map