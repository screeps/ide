"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const jsoneditor_1 = require("./jsoneditor");
exports.BTN_REMOVE = 'screeps-memory__item-remove-watch-';
exports.BTN_DELETE = 'screeps-memory__item-delete-watch-';
exports.BTN_UPDATE = 'screeps-memory__item-update-watch-';
exports.BTN_RELOAD = 'screeps-memory__item-reload-watch-';
exports.BTN_CANCEL = 'screeps-memory__item-cancel-watch-';
class MemoryItemView extends React.Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();
        this.onEdit = async () => {
            this.props.onClick && await this.props.onClick(this.state.path);
            this.setState(Object.assign({}, this.state, { isEdit: true }));
        };
        this.onSave = () => {
            if (!this.editorRef.current) {
                return;
            }
            this.onCancel();
            this.props.onSave && this.props.onSave(this.editorRef.current.getValue());
        };
        this.onReload = () => {
            this.props.onReload && this.props.onReload();
        };
        this.onCancel = () => {
            this.setState(Object.assign({}, this.state, { isEdit: false }));
            this.props.onCancel && this.props.onCancel(this.state.path);
        };
        this.onDelete = (data) => {
            this.props.onDelete && this.props.onDelete(data);
        };
        this.onRemovePath = () => {
            this.props.onRemovePath && this.props.onRemovePath();
            this.onCancel();
        };
        this.state = {
            isEdit: false,
            path: props.path,
            value: props.value
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {
            this.setState(Object.assign({}, this.state, { value: nextProps.value }));
        }
    }
    render() {
        const path = this.state.path || 'Memory root';
        let value;
        let jsonEditor;
        let deleteBtn;
        if (!this.state.isEdit) {
            let short;
            try {
                short = this.state.value.toString();
            }
            catch (err) {
                short = 'undefined';
            }
            value = (React.createElement("div", { className: 'screeps-memory__value' },
                React.createElement("button", { className: 'btn btn--clear', type: 'button', onClick: this.onEdit }, short)));
        }
        if (this.state.isEdit) {
            let deleteBtn;
            if (this.state.path) {
                deleteBtn = (React.createElement("button", { id: `${exports.BTN_DELETE}${this.state.path}`, type: 'button', className: 'btn btn--clear', onClick: this.onRemovePath, title: 'Delete from memory' },
                    React.createElement("i", { className: 'sc-icon-delete' })));
            }
            jsonEditor = (React.createElement("div", { className: 'screeps-memory__json-editor' },
                React.createElement("div", { className: 'screeps-memory__json-editor-controlls' },
                    React.createElement("button", { id: `${exports.BTN_UPDATE}${this.state.path || 'root'}`, type: 'button', className: 'btn btn--clear', onClick: this.onSave },
                        React.createElement("i", { className: 'sc-icon-done' })),
                    React.createElement("button", { id: `${exports.BTN_RELOAD}${this.state.path || 'root'}`, type: 'button', className: 'btn btn--clear', onClick: this.onReload },
                        React.createElement("i", { className: 'sc-icon-cached' })),
                    React.createElement("button", { id: `${exports.BTN_CANCEL}${this.state.path || 'root'}`, type: 'button', className: 'btn btn--clear', onClick: this.onCancel },
                        React.createElement("i", { className: 'sc-icon-clear' })),
                    deleteBtn),
                React.createElement(jsoneditor_1.default, { ref: this.editorRef, name: this.state.path, value: this.state.value })));
        }
        if (this.state.path) {
            deleteBtn = (React.createElement("div", { id: `${exports.BTN_REMOVE}${this.state.path}`, className: 'close-icon', onClick: () => this.onDelete(this.state.path) }));
        }
        return (React.createElement("div", { className: 'screeps-memory__item' },
            React.createElement("div", { className: 'screeps-memory__item-path' },
                React.createElement("label", { className: this.state.path ? '' : '--italic' }, path),
                deleteBtn),
            value,
            jsonEditor));
    }
}
exports.default = MemoryItemView;
//# sourceMappingURL=item.js.map