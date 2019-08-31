"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const item_1 = require("./item");
const input_1 = require("./input");
function sort(a, b) {
    if (a.path < b.path) {
        return -1;
    }
    if (a.path > b.path) {
        return 1;
    }
    return 0;
}
function default_1(props) {
    return (React.createElement("div", { className: 'screeps-memory__main' },
        React.createElement("div", { className: 'screeps-memory__main-items' }, props.memory.sort(sort).map(({ _id, path, value }) => {
            return (React.createElement(item_1.default, { key: _id, id: _id, path: path, value: value, isEdit: false, onClick: () => onClick(path), onReload: () => onReload(path), onDelete: () => onDelete(path), onSave: (value) => onSave(path, value), onRemovePath: () => onRemovePath(path), onCancel: () => onCancel(path) }));
        })),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement(input_1.default, { onInput: onInput })));
    function onClick(path) {
        return props.onClick && props.onClick(path);
    }
    function onReload(path) {
        return props.onReload && props.onReload(path);
    }
    function onSave(path, value) {
        return props.onSave && props.onSave(path, value);
    }
    function onDelete(path) {
        return props.onDelete && props.onDelete(path);
    }
    function onRemovePath(path) {
        return props.onRemovePath && props.onRemovePath(path);
    }
    async function onInput(path) {
        try {
            props.onInput && await props.onInput(path);
            setTimeout(() => {
                const pathRef = document.querySelector(`.screeps-memory__item[data-path='${path}']`);
                if (pathRef) {
                    pathRef.scrollIntoView();
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
    function onCancel(path) {
        return props.onCancel && props.onCancel(path);
    }
}
exports.default = default_1;
//# sourceMappingURL=main.js.map