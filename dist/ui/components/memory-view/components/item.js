"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const jsoneditor_1 = require("./jsoneditor");
exports.BTN_REMOVE = 'screeps-memory__item-remove-watch-';
exports.BTN_DELETE = 'screeps-memory__item-delete-watch-';
exports.BTN_UPDATE = 'screeps-memory__item-update-watch-';
exports.BTN_RELOAD = 'screeps-memory__item-reload-watch-';
exports.BTN_CANCEL = 'screeps-memory__item-cancel-watch-';
function default_1(props) {
    const [isEdit, setIsEdit] = react_1.useState(props.isEdit);
    const editorRef = react_1.useRef();
    let value;
    let jsonEditor;
    let deleteBtn;
    if (!isEdit) {
        let short;
        try {
            short = props.value.toString();
        }
        catch (err) {
            short = 'undefined';
        }
        value = (React.createElement("div", { className: 'screeps-memory__value' },
            React.createElement("button", { className: 'btn btn--clear', type: 'button', onClick: onEdit, onKeyPress: onEnter(onEdit), tabIndex: 7 }, short)));
    }
    else {
        let size;
        let deleteBtn;
        if (props.path) {
            deleteBtn = (React.createElement("button", { id: `${exports.BTN_DELETE}${props.id}`, tabIndex: 7, type: 'button', className: 'btn btn--clear', onClick: onRemovePath, title: 'Delete from memory' },
                React.createElement("i", { className: 'sc-icon-delete' })));
        }
        size = (React.createElement("span", null,
            (JSON.stringify(props.value).length / 1024).toFixed(1),
            " KB"));
        jsonEditor = (React.createElement("div", { className: 'screeps-memory__json-editor' },
            React.createElement("div", { className: 'screeps-memory__json-editor-controlls' },
                React.createElement("button", { id: `${exports.BTN_UPDATE}${props.id}`, tabIndex: 7, type: 'button', className: 'btn btn--clear', onClick: onSave },
                    React.createElement("i", { className: 'sc-icon-done' })),
                React.createElement("button", { id: `${exports.BTN_RELOAD}${props.id}`, tabIndex: 7, type: 'button', className: 'btn btn--clear', onClick: onReload },
                    React.createElement("i", { className: 'sc-icon-cached' })),
                React.createElement("button", { id: `${exports.BTN_CANCEL}${props.id}`, tabIndex: 7, type: 'button', className: 'btn btn--clear', onClick: onCancel },
                    React.createElement("i", { className: 'sc-icon-clear' })),
                deleteBtn,
                size),
            React.createElement(jsoneditor_1.default, { ref: editorRef, name: props.path, value: props.value })));
    }
    if (props.path) {
        deleteBtn = (React.createElement("div", { id: `${exports.BTN_REMOVE}${props.id}`, className: 'close-icon', onClick: () => onDelete(props.path) }));
    }
    return (React.createElement("div", { className: 'screeps-memory__item', "data-path": props.path },
        React.createElement("div", { className: 'screeps-memory__item-path' },
            React.createElement("label", { className: props.path ? '' : '--italic' }, props.path || 'Memory root'),
            deleteBtn),
        value,
        jsonEditor));
    async function onEdit() {
        props.onClick && await props.onClick(props.path);
        setIsEdit(!isEdit);
    }
    async function onSave() {
        try {
            // @ts-ignore
            props.onSave && await props.onSave(editorRef.current.getValue());
            onCancel();
        }
        catch (err) {
            // Noop.
        }
    }
    async function onReload() {
        const value = props.onReload && await props.onReload();
        // @ts-ignore
        editorRef.current.setValue(value);
    }
    function onCancel() {
        setIsEdit(false);
        props.onCancel && props.onCancel(props.path);
    }
    function onDelete(data) {
        props.onDelete && props.onDelete(data);
    }
    function onRemovePath() {
        onCancel();
        props.onRemovePath && props.onRemovePath();
    }
    function onEnter(handler) {
        return function ({ key }) {
            key === 'Enter' && handler();
        };
    }
}
exports.default = default_1;
//# sourceMappingURL=item.js.map