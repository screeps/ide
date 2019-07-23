"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const item_1 = require("./item");
const input_1 = require("./input");
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__main' },
        React.createElement("div", { className: 'screeps-memory__main-items' }, props.memory.map(({ path, value }) => {
            return (React.createElement(item_1.default, { key: path, path: path, value: value, isEdit: false, onClick: () => onClick(path), onReload: () => onReload(path), onDelete: () => onDelete(path), onSave: (value) => onSave(path, value), onRemovePath: () => onRemovePath(path), onCancel: () => onCancel(path) }));
        })),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement(input_1.default, { onInput: onInput })));
    async function onClick(path) {
        props.onClick && await props.onClick(path);
    }
    function onReload(path) {
        props.onReload && props.onReload(path);
    }
    function onSave(path, value) {
        props.onSave && props.onSave(path, value);
    }
    function onDelete(path) {
        props.onDelete && props.onDelete(path);
    }
    function onRemovePath(path) {
        props.onRemovePath && props.onRemovePath(path);
    }
    function onInput(path) {
        props.onInput && props.onInput(path);
    }
    function onCancel(path) {
        props.onCancel && props.onCancel(path);
    }
}
exports.default = default_1;
//# sourceMappingURL=main.js.map