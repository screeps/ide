"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const controls_1 = require("./components/controls");
const messages_list_1 = require("./components/messages-list");
const console_input_1 = require("./components/console-input");
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-ide screeps-console screeps-console__view' },
        React.createElement(controls_1.default, { shard: props.shard || '', shards: props.shards || [], paused: props.paused || false, onShard: props.onShard, onResume: props.onResume, onPause: props.onPause, onClean: props.onClean }),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement(messages_list_1.default, { messages: props.messages || [] }),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement(console_input_1.default, { onInput: props.onInput })));
}
exports.default = default_1;
//# sourceMappingURL=index.js.map