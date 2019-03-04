"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
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
            this.props.onToggleView && this.props.onToggleView({ view: 'main' });
        };
        this.onSegments = () => {
            this.props.onToggleView && this.props.onToggleView({ view: 'segments' });
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
                React.createElement("button", { className: 'btn icon', onClick: this.onMainMemory },
                    React.createElement("i", { className: 'sc-icon-dehaze' })),
                React.createElement("button", { className: 'btn icon', onClick: this.onSegments },
                    React.createElement("i", { className: 'sc-icon-view' })),
                React.createElement("button", { className: 'btn icon', onClick: this.onClose },
                    React.createElement("i", { className: 'sc-icon-clear' })))));
    }
}
exports.default = MemoryControlsView;
//# sourceMappingURL=controls.js.map