"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const MAIN_MODULE = 'main';
function default_1(props) {
    const [value, setValue] = react_1.useState('');
    const [isValid, setValid] = react_1.useState(true);
    react_1.useEffect(() => setValue(''), [props.branch]);
    return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
        React.createElement("div", { className: 'screeps-modules-view__header' },
            React.createElement("span", null, "Branch"),
            React.createElement("span", null, props.branch)),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement("div", { className: 'screeps-modules-view__items' },
            React.createElement("ul", { className: 'tab-bar' },
                React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (props.modules[MAIN_MODULE] && props.modules[MAIN_MODULE].modified ? ' modified' : '') + (props.active === `@${props.branch}/${MAIN_MODULE}.js` ? ' active' : '') },
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => onSelectModule(MAIN_MODULE) }, MAIN_MODULE),
                    React.createElement("div", { className: 'modified-icon' })),
                _getAdditionalModules(props.modules).map(([moduleName, { modified }]) => {
                    return (React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (modified ? ' modified' : '') + (props.active === `@${props.branch}/${moduleName}.js` ? ' active' : ''), key: moduleName },
                        React.createElement("button", { className: 'btn btn--clear', onClick: () => onSelectModule(moduleName) }, moduleName),
                        React.createElement("div", { className: 'close-icon', onClick: () => onDeleteModule(moduleName) })));
                }))),
        React.createElement("div", { className: 'screeps-modules-view__new' },
            React.createElement("form", { className: [!isValid ? '--invalid' : ''].join(' '), onSubmit: onSubmit },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'New module name...', autoComplete: '', onChange: onChange, value: value }),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("div", { className: 'error' }, "Already exist")))));
    function onSelectModule(module) {
        props.onSelectModule && props.onSelectModule(module);
    }
    function onDeleteModule(module) {
        props.onDeleteModule && props.onDeleteModule(module);
    }
    function onChange(event) {
        const target = event.target;
        const value = target.value;
        const isExist = Object.entries(props.modules)
            .some(([module]) => module === value);
        setValid(!isExist && value !== MAIN_MODULE);
        setValue(value);
    }
    function onSubmit(event) {
        event.preventDefault();
        if (!isValid) {
            return;
        }
        props.onCreateModule && props.onCreateModule(value);
        setValue('');
    }
    function _getAdditionalModules(modules) {
        return Object.entries(modules).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map