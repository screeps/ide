"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.BTN_SAVE = 'screeps-memory__segment-controls-save';
exports.BTN_RELOAD = 'screeps-memory__segment-controls-reload';
const segments = [];
for (let i = 0; i < 100; i++) {
    segments.push(i);
}
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__segment-controls' },
        "Segment #:",
        React.createElement("select", { className: 'native-key-bindings input-select', value: props.segment, onChange: onSegment, tabIndex: 2 }, segments.map((name) => {
            return (React.createElement("option", { key: name, value: name }, name));
        })),
        React.createElement("button", { id: `${exports.BTN_RELOAD}`, type: 'button', className: 'native-key-bindings btn', onClick: onRefresh, onKeyPress: onEnter(onRefresh), tabIndex: 3 },
            React.createElement("i", { className: 'sc-icon-cached' })),
        React.createElement("button", { id: `${exports.BTN_SAVE}`, type: 'button', className: 'native-key-bindings btn', onClick: onUpdate, onKeyPress: onEnter(onUpdate), tabIndex: 4, disabled: !props.hasChange },
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
    function onEnter(handler) {
        return function ({ key }) {
            key === 'Enter' && handler();
        };
    }
}
exports.default = default_1;
//# sourceMappingURL=segment-controls.js.map