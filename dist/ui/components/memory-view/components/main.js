"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const item_1 = require("./item");
const input_1 = require("./input");
class MemoryMainView extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = async (path) => {
            this.props.onClick && await this.props.onClick(path);
        };
        this.onReload = (path) => {
            this.props.onReload && this.props.onReload(path);
        };
        this.onSave = (path, value) => {
            this.props.onSave && this.props.onSave(path, value);
        };
        this.onDelete = (data) => {
            this.props.onDelete && this.props.onDelete(data);
        };
        this.onInput = (data) => {
            this.props.onInput && this.props.onInput(data);
        };
        this.state = {
            watches: props.watches
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.watches) {
            this.setState({
                watches: nextProps.watches
            });
        }
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__main' },
            React.createElement("div", { className: 'screeps-memory__main-items' }, this.state.watches.map(({ path, data, value }, index) => {
                // console.log(item);
                return (React.createElement(item_1.default, { key: index, path: path, data: data, value: value, onClick: () => this.onClick(path), onReload: () => this.onReload(path), onDelete: this.onDelete, onSave: (value) => this.onSave(path, value) }));
            })),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(input_1.default, { onInput: this.onInput })));
    }
}
exports.default = MemoryMainView;
//# sourceMappingURL=main.js.map