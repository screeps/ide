"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const item_1 = require("./item");
const input_1 = require("./input");
class MemoryMainView extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = (data) => {
            this.props.onClick && this.props.onClick(data);
        };
        this.onDelete = (data) => {
            this.props.onDelete && this.props.onDelete(data);
        };
        this.onInput = (data) => {
            this.props.onInput && this.props.onInput(data);
        };
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__main' },
            React.createElement("div", { className: 'screeps-memory__main-items' }, this.props.watches.map((item, index) => {
                // console.log(item);
                return (React.createElement(item_1.default, { key: index, item: item, onClick: this.onClick, onDelete: this.onDelete }));
            })),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(input_1.default, { onInput: this.onInput })));
    }
}
exports.default = MemoryMainView;
//# sourceMappingURL=main.js.map