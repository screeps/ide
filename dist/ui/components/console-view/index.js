"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const controls_1 = require("./components/controls");
const messages_list_1 = require("./components/messages-list");
const console_input_1 = require("./components/console-input");
class ConsoleView extends React.Component {
    constructor(props) {
        super(props);
        this.onResume = () => {
            this.setState(Object.assign({}, this.state, { paused: false }));
            this.props.onResume && this.props.onResume();
        };
        this.onPause = () => {
            this.setState(Object.assign({}, this.state, { paused: true }));
            this.props.onPause && this.props.onPause();
        };
        this.onShard = (shard) => {
            this.setState(Object.assign({}, this.state, { shard }));
            this.props.onShard && this.props.onShard(shard);
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onDelete = () => {
            this.setState(Object.assign({}, this.state, { messages: [] }));
        };
        this.onInput = (expression) => {
            this.props.onInput && this.props.onInput(expression);
        };
        this.state = {
            shard: props.shard,
            shards: props.shards || [],
            paused: true,
            messages: props.messages || []
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-console screeps-console__view' },
            React.createElement(controls_1.default, { shard: this.state.shard, shards: this.state.shards, paused: this.state.paused, onShard: this.onShard, onResume: this.onResume, onPause: this.onPause, onClose: this.onClose, onDelete: this.onDelete }),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(messages_list_1.default, { messages: this.state.messages || [] }),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(console_input_1.default, { onInput: this.onInput })));
    }
}
exports.default = ConsoleView;
//# sourceMappingURL=index.js.map