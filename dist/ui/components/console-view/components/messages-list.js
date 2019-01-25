"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const message_item_1 = require("./message-item");
class ConsoleMessagesListView extends React.Component {
    constructor(props) {
        super(props);
        this.messagesBottomRef = null;
        this.state = {};
    }
    render() {
        return (React.createElement("div", { className: 'screeps-console__messages' },
            this.props.messages.map((message, index) => {
                return (React.createElement(message_item_1.default, { key: index, message: message }));
            }),
            React.createElement("div", { ref: (el) => this.messagesBottomRef = el })));
    }
    componentDidUpdate() {
        //@ts-ignore
        this.messagesBottomRef.scrollIntoView({ behavior: "smooth" });
    }
}
exports.default = ConsoleMessagesListView;
//# sourceMappingURL=messages-list.js.map