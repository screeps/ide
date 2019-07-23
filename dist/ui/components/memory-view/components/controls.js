"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MEMORY_MAIN_VIEW = 'MEMORY_MAIN_VIEW';
exports.MEMORY_SEGMENTS_VIEW = 'MEMORY_SEGMENTS_VIEW';
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__controls' },
        React.createElement("div", { className: '' },
            React.createElement("select", { className: 'input-select', onChange: onShard, value: props.shard }, props.shards.map(({ name }) => {
                return (React.createElement("option", { key: name, value: name }, name));
            })),
            props.children),
        React.createElement("div", { className: 'btn-group' },
            React.createElement("button", { id: 'screeps-memory__control-main', className: 'btn icon', onClick: onMainMemory },
                React.createElement("i", { className: 'sc-icon-dehaze' })),
            React.createElement("button", { id: 'screeps-memory__control-segments', className: 'btn icon', onClick: onSegments },
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
}
exports.default = default_1;
//# sourceMappingURL=controls.js.map