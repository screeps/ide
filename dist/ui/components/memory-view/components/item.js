"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const json_editor_1 = require("./json-editor");
class MemoryItemView extends React.Component {
    constructor(props) {
        super(props);
        this.onEdit = () => {
            console.log(this.props.item);
            this.setState(Object.assign({}, this.state, { isEdit: true }));
            this.props.onClick && this.props.onClick(this.props.item);
        };
        this.onSave = () => {
            console.log('onSave');
        };
        this.onReload = () => {
            console.log('onReload');
        };
        this.onCancel = () => {
            this.setState(Object.assign({}, this.state, { isEdit: false }));
            console.log('onCancel');
        };
        this.onDelete = (data) => {
            this.props.onDelete && this.props.onDelete(data);
        };
        this.state = { isEdit: false };
    }
    render() {
        const path = this.props.item.path || 'Memory root';
        let value;
        let jsonEditor;
        let deleteBtn;
        if (!this.state.isEdit || !this.props.item.data) {
            value = (React.createElement("div", { className: 'screeps-memory__value' },
                React.createElement("button", { className: 'btn btn--clear', type: 'button', onClick: this.onEdit }, this.props.item.value)));
        }
        if (this.state.isEdit && this.props.item.data) {
            jsonEditor = (React.createElement("div", { className: 'screeps-memory__json-editor' },
                React.createElement("div", { className: 'screeps-memory__json-editor-controlls' },
                    React.createElement("button", { type: 'button', className: 'btn btn--clear', onClick: this.onSave },
                        React.createElement("i", { className: 'sc-icon-done' })),
                    React.createElement("button", { type: 'button', className: 'btn btn--clear', onClick: this.onReload },
                        React.createElement("i", { className: 'sc-icon-cached' })),
                    React.createElement("button", { type: 'button', className: 'btn btn--clear', onClick: this.onCancel },
                        React.createElement("i", { className: 'sc-icon-clear' })),
                    React.createElement("button", { type: 'button', className: 'btn btn--clear', onClick: this.onDelete },
                        React.createElement("i", { className: 'sc-icon-delete' }))),
                React.createElement(json_editor_1.default, { data: this.props.item.data })));
        }
        if (this.props.item.path) {
            deleteBtn = (React.createElement("div", { className: 'close-icon', onClick: () => this.onDelete(this.props.item.path) }));
        }
        return (React.createElement("div", { className: 'screeps-memory__item' },
            React.createElement("div", { className: 'screeps-memory__expression' },
                React.createElement("label", { className: this.props.item.path ? '' : '--italic' }, path),
                deleteBtn),
            value,
            jsonEditor));
    }
}
exports.default = MemoryItemView;
//# sourceMappingURL=item.js.map