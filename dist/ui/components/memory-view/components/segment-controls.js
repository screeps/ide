"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const segments = [];
for (let i = 0; i < 100; i++) {
    segments.push(i);
}
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__segment-controls' },
        "Segment #:",
        React.createElement("select", { className: 'input-select', onChange: onSegment, value: props.segment }, segments.map((name) => {
            return (React.createElement("option", { key: name, value: name }, name));
        })),
        React.createElement("button", { type: 'button', className: 'btn', onClick: onRefresh },
            React.createElement("i", { className: 'sc-icon-cached' })),
        React.createElement("button", { type: 'button', className: 'btn', onClick: onUpdate, disabled: !props.hasChange },
            React.createElement("i", { className: 'sc-icon-done' }))));
    function onSegment(event) {
        props.onSegment && props.onSegment(event.target.value);
    }
    function onRefresh() {
        props.onSegment && props.onSegment(props.segment);
    }
    function onUpdate(event) {
        props.onUpdate && props.onUpdate(event.target.value);
    }
}
exports.default = default_1;
//# sourceMappingURL=segment-controls.js.map