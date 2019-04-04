"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ConsoleControlsView extends React.Component {
    constructor(props) {
        super(props);
        this.onShard = (event) => {
            this.props.onShard && this.props.onShard(event.target.value);
        };
        this.onPause = () => {
            this.state.paused = false;
            this.setState(Object.assign({}, this.state));
            this.props.onPause && this.props.onPause();
        };
        this.onResume = () => {
            this.state.paused = true;
            this.setState(Object.assign({}, this.state));
            this.props.onResume && this.props.onResume();
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onDelete = () => {
            this.props.onDelete && this.props.onDelete();
        };
        this.state = {
            paused: props.paused
        };
    }
    render() {
        let toggle;
        if (!this.state.paused) {
            toggle = (React.createElement("button", { id: 'screeps-console__play', className: 'btn icon', onClick: this.onResume },
                React.createElement("i", { className: 'sc-icon-play' })));
        }
        else {
            toggle = (React.createElement("button", { id: 'screeps-console__pause', className: 'btn icon', onClick: this.onPause },
                React.createElement("i", { className: 'sc-icon-pause' })));
        }
        return (React.createElement("div", { className: 'screeps-console__controls' },
            React.createElement("div", { className: '' },
                React.createElement("select", { className: 'input-select', onChange: this.onShard, value: this.props.shard }, this.props.shards.map(({ name }) => {
                    return (React.createElement("option", { key: name, value: name }, name));
                }))),
            React.createElement("div", { className: 'btn-group' },
                React.createElement("button", { id: 'screeps-console__delete', className: 'btn icon', onClick: this.onDelete },
                    React.createElement("i", { className: 'sc-icon-delete' })),
                toggle)));
    }
}
exports.default = ConsoleControlsView;
//# sourceMappingURL=controls.js.map