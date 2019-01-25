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
        if (this.props.message.data[1].shard) {
            shard = (React.createElement("span", null,
                React.createElement("span", { className: 'brackets' }, this.props.message.data[1].shard),
                "\u00A0"));
        }
        try {
            message = (React.createElement("span", { className: timestamp ? '' : '--input' }, this.props.message.data[1].messages.log[0]));
        }
        catch (err) {
            error = (React.createElement("span", { className: '--error' }, this.props.message.data[1].error));
        }
        return (React.createElement("div", { className: 'screeps-console__message' },
            timestamp,
            shard,
            message,
            error));
    }
}
exports.default = ConsoleMessageItemView;
//# sourceMappingURL=message-item.js.map