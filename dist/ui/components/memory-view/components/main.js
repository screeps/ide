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
        this.onDelete = (path) => {
            this.props.onDelete && this.props.onDelete(path);
        };
        this.onRemovePath = (path) => {
            this.props.onRemovePath && this.props.onRemovePath(path);
        };
        this.onInput = (path) => {
            this.props.onInput && this.props.onInput(path);
        };
        this.state = {
            memory: props.memory
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.memory) {
            this.setState({
                memory: nextProps.memory
            });
        }
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__main' },
            React.createElement("div", { className: 'screeps-memory__main-items' }, this.state.memory.map(({ path, value }) => {
                return (React.createElement(item_1.default, { key: path, path: path, value: value, onClick: () => this.onClick(path), onReload: () => this.onReload(path), onDelete: () => this.onDelete(path), onSave: (value) => this.onSave(path, value), onRemovePath: () => this.onRemovePath(path) }));
            })),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(input_1.default, { onInput: this.onInput })));
    }
}
exports.default = MemoryMainView;
//# sourceMappingURL=main.js.map