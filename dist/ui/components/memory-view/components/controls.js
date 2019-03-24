"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.MEMORY_MAIN_VIEW = 'MEMORY_MAIN_VIEW';
exports.MEMORY_SEGMENTS_VIEW = 'MEMORY_SEGMENTS_VIEW';
class MemoryControlsView extends React.Component {
    constructor(props) {
        super(props);
        this.onShard = (event) => {
            this.props.onShard && this.props.onShard(event.target.value);
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onMainMemory = () => {
            this.props.onToggleView && this.props.onToggleView(exports.MEMORY_MAIN_VIEW);
        };
        this.onSegments = () => {
            this.props.onToggleView && this.props.onToggleView(exports.MEMORY_SEGMENTS_VIEW);
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__controls' },
            React.createElement("div", { className: '' },
                React.createElement("select", { className: 'btn', onChange: this.onShard, value: this.props.shard }, this.props.shards.map(({ name }) => {
                    return (React.createElement("option", { key: name, value: name }, name));
                })),
                this.props.children),
            React.createElement("div", { className: 'btn-group' },
                React.createElement("button", { id: 'screeps-memory__control-main', className: 'btn icon', onClick: this.onMainMemory },
                    React.createElement("i", { className: 'sc-icon-dehaze' })),
                React.createElement("button", { id: 'screeps-memory__control-segments', className: 'btn icon', onClick: this.onSegments },
                    React.createElement("i", { className: 'sc-icon-view' })))));
    }
}
exports.default = MemoryControlsView;
//# sourceMappingURL=controls.js.map