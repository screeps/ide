"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ConsoleMessageItemView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let timestamp, shard, message, error;
        if (this.props.message.timeStamp) {
            timestamp = (React.createElement("span", null,
                React.createElement("span", { className: 'brackets' }, new Date(this.props.message.timeStamp).toLocaleTimeString()),
                "\u00A0"));
        }
        if (this.props.message.shard) {
            shard = (React.createElement("span", null,
                React.createElement("span", { className: 'brackets' }, this.props.message.shard),
                "\u00A0"));
        }
        if (this.props.message.log) {
            message = (React.createElement("span", null, this.props.message.log));
        }
        if (this.props.message.expression) {
            message = (React.createElement("span", { className: '--input' }, this.props.message.expression));
        }
        if (this.props.message.result) {
            message = (React.createElement("span", { className: '--output' }, this.props.message.result));
        }
        if (this.props.message.error) {
            error = (React.createElement("span", { className: '--error' }, this.props.message.error));
        }
        return (React.createElement("div", { className: 'screeps-console__message native-key-bindings', tabIndex: -1 },
            timestamp,
            shard,
            message,
            error));
    }
}
exports.default = ConsoleMessageItemView;
//# sourceMappingURL=message-item.js.map