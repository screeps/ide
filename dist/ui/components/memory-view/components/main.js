"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const item_1 = require("./item");
class MemoryMainView extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = (data) => {
            this.props.onClick && this.props.onClick(data);
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__main' }, this.props.watches.map((item, index) => {
            // console.log(item);
            return (React.createElement(item_1.default, { key: index, item: item, onClick: this.onClick }));
        })));
    }
}
exports.default = MemoryMainView;
//# sourceMappingURL=main.js.map