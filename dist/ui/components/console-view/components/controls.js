"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ConsoleControlsView extends React.Component {
    constructor(props) {
        super(props);
        this.onShard = (event) => {
            this.props.onShard && this.props.onShard(event.target.value);
        };
        this.onStart = () => {
            this.props.onStart && this.props.onStart();
        };
        this.onPause = () => {
            this.props.onPause && this.props.onPause();
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onDelete = () => {
            this.props.onDelete && this.props.onDelete();
        };
    }
    render() {
        let toggle;
        if (this.props.paused) {
            toggle = (React.createElement("button", { className: 'btn icon', onClick: this.onStart },
                React.createElement("i", { className: 'sc-icon-play' })));
        }
        else {
            toggle = (React.createElement("button", { className: 'btn icon', onClick: this.onPause },
                React.createElement("i", { className: 'sc-icon-pause' })));
        }
        return (React.createElement("div", { className: 'screeps-console__controls' },
            React.createElement("div", { className: '' },
                React.createElement("select", { className: 'btn', onChange: this.onShard }, this.props.shards.map(({ name }) => {
                    return (React.createElement("option", { key: name, value: name }, name));
                }))),
            React.createElement("div", { className: 'btn-group' },
                React.createElement("button", { className: 'btn icon', onClick: this.onDelete },
                    React.createElement("i", { className: 'sc-icon-delete' })),
                toggle,
                React.createElement("button", { className: 'btn icon', onClick: this.onClose },
                    React.createElement("i", { className: 'sc-icon-clear' })))));
    }
}
exports.default = ConsoleControlsView;
//# sourceMappingURL=controls.js.map