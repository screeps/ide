"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const MAIN_MODULE = 'main';
function default_1(props) {
    const [value, setValue] = react_1.useState('');
    const [isValid, setValid] = react_1.useState(true);
    const [modules, setModules] = react_1.useState([]);
    const [scrollTo, setScrollTo] = react_1.useState();
    react_1.useEffect(() => {
        setValue('');
        setValid(true);
    }, [props.branch]);
    react_1.useEffect(() => {
        const _modules = Object.entries(props.modules).sort(([a], [b]) => {
            if (a > b)
                return 1;
            if (a < b)
                return -1;
            return 0;
        }).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
        setModules(_modules);
    }, [props.modules]);
    react_1.useEffect(() => {
        if (!scrollTo) {
            return;
        }
        const pathRef = document.querySelector(`.screeps-modules-view__item[data-module='${scrollTo}']`);
        if (pathRef) {
            pathRef.scrollIntoView();
        }
        setScrollTo(null);
    }, [modules]);
    return (React.createElement("div", { className: 'screeps-ide screeps-modules-view' },
        React.createElement("div", { className: 'screeps-modules-view__header' },
            React.createElement("span", null, "Modules in branch"),
            React.createElement("span", null, props.branch)),
        React.createElement("hr", { className: 'screeps-hr' }),
        React.createElement("div", { className: 'screeps-modules-view__items' },
            React.createElement("ul", { className: 'tab-bar' },
                React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (props.modules[MAIN_MODULE] && props.modules[MAIN_MODULE].modified ? ' modified' : '') + (props.active === `@${props.branch}/${MAIN_MODULE}.js` ? ' active' : ''), "data-module": MAIN_MODULE },
                    React.createElement("button", { className: 'btn btn--clear', onClick: () => onSelectModule(MAIN_MODULE), onDoubleClick: () => onSelectModule(MAIN_MODULE, false) }, MAIN_MODULE),
                    React.createElement("div", { className: 'modified-icon' })),
                modules.map(([moduleName, { modified }]) => {
                    return (React.createElement("li", { className: 'tab screeps-modules-view__item screeps-modules-view__module' + (modified ? ' modified' : '') + (props.active === `@${props.branch}/${moduleName}.js` ? ' active' : ''), key: moduleName, "data-module": moduleName },
                        React.createElement("button", { className: 'btn btn--clear', onClick: () => onSelectModule(moduleName), onDoubleClick: () => onSelectModule(moduleName, false) }, moduleName),
                        React.createElement("div", { className: 'close-icon', onClick: () => onDeleteModule(moduleName) })));
                }))),
        React.createElement("div", { className: 'screeps-modules-view__new' },
            React.createElement("form", { className: [!isValid ? '--invalid' : ''].join(' '), onSubmit: onSubmit },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'New module name...', autoComplete: '', onChange: onChange, value: value }),
                    React.createElement("div", { className: 'underline' })),
                React.createElement("div", { className: 'error' }, "Already exist")))));
    function onSelectModule(module, textEditorPending = true) {
        props.onSelectModule && props.onSelectModule(module, textEditorPending);
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
        if (!isValid || !value) {
            return;
        }
        props.onCreateModule && props.onCreateModule(value);
        setValue('');
        setScrollTo(value);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map