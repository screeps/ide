"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MEMORY_MAIN_VIEW = 'MEMORY_MAIN_VIEW';
exports.MEMORY_SEGMENTS_VIEW = 'MEMORY_SEGMENTS_VIEW';
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__controls' },
        React.createElement("div", { className: '' },
            React.createElement("select", { className: 'native-key-bindings input-select', value: props.shard, onChange: onShard, tabIndex: 1 }, props.shards.map(({ name }) => {
                return (React.createElement("option", { key: name, value: name }, name));
            })),
            props.children),
        React.createElement("div", { className: 'btn-group' },
            React.createElement("button", { id: 'screeps-memory__control-main', className: ['native-key-bindings btn icon', props.view === exports.MEMORY_MAIN_VIEW ? 'selected' : ''].join(' '), onClick: onMainMemory, onKeyPress: onEnter(onMainMemory), tabIndex: 5 },
                React.createElement("i", { className: 'sc-icon-dehaze' })),
            React.createElement("button", { id: 'screeps-memory__control-segments', className: ['native-key-bindings btn icon', props.view === exports.MEMORY_SEGMENTS_VIEW ? 'selected' : ''].join(' '), onClick: onSegments, onKeyPress: onEnter(onSegments), tabIndex: 6 },
                React.createElement("i", { className: 'sc-icon-view' })))));
    function onShard(event) {
        props.onShard && props.onShard(event.target.value);
    }
    function onMainMemory() {
        props.onToggleView && props.onToggleView(exports.MEMORY_MAIN_VIEW);
    }
    function onSegments() {
        props.onToggleView && props.onToggleView(exports.MEMORY_SEGMENTS_VIEW);
    }
    function onEnter(handler) {
        return function ({ key }) {
            key === 'Enter' && handler();
        };
    }
}
exports.default = default_1;
//# sourceMappingURL=controls.js.map