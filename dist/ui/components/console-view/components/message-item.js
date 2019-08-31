"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function default_1(props) {
    let timestamp, shard, message, error;
    if (props.message.timeStamp) {
        timestamp = (React.createElement("span", { className: '--timestamp' },
            "[",
            new Date(props.message.timeStamp).toLocaleTimeString(),
            "]"));
    }
    if (props.message.shard) {
        shard = (React.createElement("span", { className: '--shard' },
            "[",
            props.message.shard,
            "]"));
    }
    if (props.message.log) {
        message = (React.createElement("span", { className: '--log', dangerouslySetInnerHTML: { __html: unescapeHTML(props.message.log) } }));
    }
    if (props.message.expression) {
        message = (React.createElement("span", { className: '--input' }, unescapeHTML(props.message.expression)));
    }
    if (props.message.result) {
        message = (React.createElement("span", { className: '--output' }, unescapeHTML(props.message.result)));
    }
    if (props.message.error) {
        error = (React.createElement("span", { className: '--error' }, unescapeHTML(props.message.error)));
    }
    return (React.createElement("div", { className: 'screeps-console__message native-key-bindings', tabIndex: -1 },
        timestamp,
        shard,
        message,
        error));
}
exports.default = default_1;
//# sourceMappingURL=message-item.js.map