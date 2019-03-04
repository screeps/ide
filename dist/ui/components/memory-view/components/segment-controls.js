"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const segments = [];
for (let i = 0; i < 100; i++) {
    segments.push(i);
}
class MemorySegmentControlsView extends React.Component {
    constructor(props) {
        super(props);
        this.onSegment = (event) => {
            this.setState(Object.assign({}, this.state, { segment: event.target.value }));
            this.props.onSegment && this.props.onSegment(event.target.value);
        };
        this.onRefresh = () => {
            this.props.onSegment && this.props.onSegment(this.state.segment);
        };
        this.onUpdate = (event) => {
            this.props.onUpdate && this.props.onUpdate(event.target.value);
        };
        this.state = {
            segment: props.segment,
            hasChange: props.hasChange
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { hasChange: nextProps.hasChange }));
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__segment-controls' },
            "Segment #:",
            React.createElement("select", { className: 'btn', onChange: this.onSegment, value: this.state.segment }, segments.map((name) => {
                return (React.createElement("option", { key: name, value: name }, name));
            })),
            React.createElement("button", { type: 'button', className: 'btn', onClick: this.onRefresh },
                React.createElement("i", { className: 'sc-icon-cached' })),
            React.createElement("button", { type: 'button', className: 'btn', onClick: this.onUpdate, disabled: !this.state.hasChange },
                React.createElement("i", { className: 'sc-icon-done' }))));
    }
}
exports.default = MemorySegmentControlsView;
//# sourceMappingURL=segment-controls.js.map