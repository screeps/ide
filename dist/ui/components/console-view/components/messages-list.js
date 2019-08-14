"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const message_item_1 = require("./message-item");
let scrollToBottom = true;
function default_1({ messages }) {
    const messagesRef = react_1.useRef(null);
    const messagesBottomRef = react_1.useRef(null);
    react_1.useEffect(() => {
        if (!messagesBottomRef.current || !scrollToBottom) {
            return;
        }
        // @ts-ignore
        messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (React.createElement("div", { className: 'screeps-console__messages', ref: messagesRef, onScroll: onScroll },
        messages.map((message, index) => {
            return (React.createElement(message_item_1.default, { key: index, message: message }));
        }),
        React.createElement("div", { ref: messagesBottomRef })));
    function onScroll() {
        if (!messagesRef.current) {
            return;
        }
        const { offsetHeight, scrollHeight, scrollTop } = messagesRef.current;
        scrollToBottom = (scrollTop + offsetHeight) >= scrollHeight;
    }
}
exports.default = default_1;
//# sourceMappingURL=messages-list.js.map