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
        this._shards$ = null;
        this._pipe$ = null;
        this.onDelete = (path) => {
            this.props.onDelete && this.props.onDelete(path);
        };
        this.onInput = (data) => {
            this.props.onInput && this.props.onInput(data);
        };
        this.onShard = (shard) => {
            this.setState(Object.assign({}, this.state, { shard }));
            this.props.onShard && this.props.onShard(shard);
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onToggleView = ({ view }) => {
            this.setState(Object.assign({}, this.state, { view }));
        };
        this.onMemory = async (path) => {
            this.props.onMemory && await this.props.onMemory(path);
        };
        this.onMemoryUpdate = (path, value) => {
            this.props.onMemoryUpdate && this.props.onMemoryUpdate(path, value);
        };
        this.onMemoryRefresh = (path) => {
            this.props.onMemoryRefresh && this.props.onMemoryRefresh(path);
        };
        this.onSegment = (segment) => {
            this.setState(Object.assign({}, this.state, { segment }));
            this.props.onSegment && this.props.onSegment(segment);
        };
        this.onSegmentChange = (data) => {
            this.setState(Object.assign({}, this.state, { segmentData: data, segmentHasChange: this.state._segmentData !== data }));
        };
        this.onSegmentRefresh = () => {
            this.props.onSegmentRefresh && this.props.onSegmentRefresh(this.state.segment);
        };
        this.onSegmentUpdate = () => {
            this.props.onSegmentUpdate && this.props.onSegmentUpdate(this.state.segmentData);
        };
        this.state = {
            isProgressing: false,
            shard: props.shard,
            shards: [],
            view: 'main',
            segment: props.segment,
            segmentData: '',
            _segmentData: '',
            segmentHasChange: false,
            watches: props.watches
        };
    }
    componentDidMount() {
        if (this.props.shards) {
            this.initShardsPipeSubscription();
        }
    }
    render() {
        let view, segmentControls;
        if (this.state.view === 'main') {
            view = (React.createElement(main_1.default, { watches: this.state.watches, onDelete: this.onDelete, onInput: this.onInput, onClick: this.onMemory, onSave: this.onMemoryUpdate, onReload: this.onMemoryRefresh }));
        }
        if (this.state.view === 'segments') {
            view = (React.createElement(segment_1.default, { segment: this.state.segmentData, onChange: this.onSegmentChange }));
            segmentControls = (React.createElement(segment_controls_1.default, { segment: this.state.segment, hasChange: this.state.segmentHasChange, onSegment: this.onSegment, onRefresh: this.onSegmentRefresh, onUpdate: this.onSegmentUpdate }));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-memory screeps-memory__view' },
            React.createElement(controls_1.default, { shard: this.state.shard, shards: this.state.shards, onShard: this.onShard, onClose: this.onClose, onToggleView: this.onToggleView }, segmentControls),
            React.createElement("hr", { className: 'screeps-hr' + (this.state.isProgressing ? ' screeps-hr--inprogress' : '') }),
            view));
    }
    initShardsPipeSubscription() {
        this._shards$ = this.props.shards.subscribe((shards) => {
            this.setState(Object.assign({}, this.state, { shards }));
        });
    }
}
exports.default = MemoryView;
//# sourceMappingURL=index.js.map