"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const controls_1 = require("./components/controls");
const main_1 = require("./components/main");
const segment_1 = require("./components/segment");
const segment_controls_1 = require("./components/segment-controls");
function default_1(props) {
    let memoryView, memoryControls;
    const [segmentData, setSegmentData] = react_1.useState(props.segmentData || '');
    const [segmentHasChange, setSegmentHasChange] = react_1.useState(false);
    react_1.useEffect(() => {
        onSegmentChange(props.segmentData);
    }, [props.segmentData]);
    if (props.view === controls_1.MEMORY_MAIN_VIEW) {
        memoryView = (React.createElement(main_1.default, { memory: props.memory || [], onInput: onInput, onClick: onMemory, onSave: onMemoryUpdate, onReload: onMemoryRefresh, onDelete: onMemoryDelete, onRemovePath: onMemoryRemove, onCancel: onMemoryCancel }));
    }
    if (props.view === controls_1.MEMORY_SEGMENTS_VIEW) {
        memoryView = (React.createElement(segment_1.default, { segment: segmentData, onChange: onSegmentChange }));
        memoryControls = (React.createElement(segment_controls_1.default, { segment: props.segment, hasChange: segmentHasChange, onSegment: onSegment, onUpdate: onSegmentUpdate }));
    }
    return (React.createElement("div", { className: 'screeps-ide screeps-memory screeps-memory__view' },
        React.createElement(controls_1.default, { shard: props.shard, shards: props.shards || [], onShard: onShard, onClose: onClose, onToggleView: onToggleView }, memoryControls),
        React.createElement("hr", { className: 'screeps-hr' + (props.isProgressing ? ' screeps-hr--inprogress' : '') }),
        memoryView));
    function onInput(path) {
        props.onInput && props.onInput(path);
    }
    function onShard(shard) {
        props.onShard && props.onShard(shard);
    }
    function onClose() {
        props.onClose && props.onClose();
    }
    function onToggleView(view) {
        props.onChangeView && props.onChangeView(view);
    }
    async function onMemory(path) {
        props.onMemory && await props.onMemory(path, props.shard);
    }
    function onMemoryUpdate(path, value) {
        props.onMemoryUpdate && props.onMemoryUpdate(path, value, props.shard);
    }
    function onMemoryRefresh(path) {
        props.onMemoryRefresh && props.onMemoryRefresh(path, props.shard);
    }
    function onMemoryRemove(path) {
        props.onMemoryRemove && props.onMemoryRemove(path, props.shard);
    }
    function onMemoryDelete(path) {
        props.onMemoryDelete && props.onMemoryDelete(path);
    }
    function onMemoryCancel(path) {
        props.onMemoryCancel && props.onMemoryCancel(path);
    }
    function onSegment(segment) {
        props.onSegment && props.onSegment(segment, props.shard);
    }
    function onSegmentChange(data) {
        setSegmentData(data);
        setSegmentHasChange(props.segmentData ? data !== props.segmentData : data !== '');
    }
    function onSegmentUpdate() {
        props.onSegmentUpdate && props.onSegmentUpdate(props.segment, segmentData, props.shard);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map