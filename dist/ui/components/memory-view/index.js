"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const controls_1 = require("./components/controls");
const main_1 = require("./components/main");
const segment_1 = require("./components/segment");
const segment_controls_1 = require("./components/segment-controls");
class MemoryView extends React.Component {
    constructor(props) {
        super(props);
        this.onInput = (path) => {
            this.props.onInput && this.props.onInput(path);
        };
        this.onShard = (shard) => {
            this.state.shard = shard;
            this.setState(Object.assign({}, this.state, { shard }));
            this.props.onShard && this.props.onShard(shard);
            if (this.state.view === controls_1.MEMORY_SEGMENTS_VIEW) {
                this.onSegment(this.state.segment);
            }
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onToggleView = (view) => {
            this.state.view = view;
            this.setState(Object.assign({}, this.state, { view }));
            if (view === controls_1.MEMORY_SEGMENTS_VIEW) {
                this.onSegment(this.state.segment);
            }
        };
        this.onMemory = async (path) => {
            this.props.onMemory && await this.props.onMemory(path, this.state.shard);
        };
        this.onMemoryUpdate = (path, value) => {
            this.props.onMemoryUpdate && this.props.onMemoryUpdate(path, value, this.state.shard);
        };
        this.onMemoryRefresh = (path) => {
            this.props.onMemoryRefresh && this.props.onMemoryRefresh(path, this.state.shard);
        };
        this.onMemoryRemove = (path) => {
            this.props.onMemoryRemove && this.props.onMemoryRemove(path, this.state.shard);
        };
        this.onMemoryDelete = (path) => {
            this.props.onMemoryDelete && this.props.onMemoryDelete(path);
        };
        this.onSegment = (segment) => {
            this.props.onSegment && this.props.onSegment(segment, this.state.shard);
            this.setState(Object.assign({}, this.state, { segment }));
        };
        this.onSegmentChange = (data) => {
            this.setState(Object.assign({}, this.state, { segmentData: data, segmentHasChange: this.state._segmentData !== data }));
        };
        this.onSegmentRefresh = () => {
            const { segment, shard } = this.state;
            this.props.onSegmentRefresh && this.props.onSegmentRefresh(segment, shard);
        };
        this.onSegmentUpdate = () => {
            const { segment, segmentData, shard } = this.state;
            this.props.onSegmentUpdate && this.props.onSegmentUpdate(segment, segmentData, shard);
        };
        this.state = {
            isProgressing: false,
            shard: props.shard,
            shards: props.shards || [],
            view: controls_1.MEMORY_MAIN_VIEW,
            segment: props.segment,
            segmentData: '',
            _segmentData: '',
            segmentHasChange: false,
            memory: props.memory || []
        };
    }
    render() {
        let view, segmentControls;
        if (this.state.view === controls_1.MEMORY_MAIN_VIEW) {
            view = (React.createElement(main_1.default, { memory: this.state.memory, onInput: this.onInput, onClick: this.onMemory, onSave: this.onMemoryUpdate, onReload: this.onMemoryRefresh, onDelete: this.onMemoryDelete, onRemovePath: this.onMemoryRemove }));
        }
        if (this.state.view === controls_1.MEMORY_SEGMENTS_VIEW) {
            view = (React.createElement(segment_1.default, { segment: this.state.segmentData, onChange: this.onSegmentChange }));
            segmentControls = (React.createElement(segment_controls_1.default, { segment: this.state.segment, hasChange: this.state.segmentHasChange, onSegment: this.onSegment, onRefresh: this.onSegmentRefresh, onUpdate: this.onSegmentUpdate }));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-memory screeps-memory__view' },
            React.createElement(controls_1.default, { shard: this.state.shard, shards: this.state.shards, onShard: this.onShard, onClose: this.onClose, onToggleView: this.onToggleView }, segmentControls),
            React.createElement("hr", { className: 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') }),
            view));
    }
}
exports.default = MemoryView;
//# sourceMappingURL=index.js.map