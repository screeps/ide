"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
let removeEventListener;
function default_1({ onInput }) {
    const [value, setValue] = react_1.useState('');
    const [history, setHistory] = react_1.useState([]);
    const [historyIndex, setHistoryIndex] = react_1.useState(-1);
    react_1.useEffect(() => {
        if (historyIndex >= 0 && historyIndex < history.length) {
            setValue(history[historyIndex]);
            return;
        }
        if (historyIndex === -1) {
            setValue('');
            return;
        }
    }, [historyIndex]);
    // TODO: Right way doesn't work in atom. 
    //- https://stackoverflow.com/questions/52843671/onkeydown-react-event-does-not-fire-in-atom-editor-package
    const inputRef = react_1.useRef(null);
    if (inputRef.current) {
        removeEventListener && removeEventListener();
        // @ts-ignore
        inputRef.current.addEventListener('keydown', onKeyPress);
        removeEventListener = () => {
            // @ts-ignore
            inputRef.current.removeEventListener('keydown', onKeyPress);
            removeEventListener = null;
        };
    }
    react_1.useEffect(() => {
        try {
            // @ts-ignore
            inputRef.current.focus();
            removeEventListener && removeEventListener();
            // @ts-ignore
            inputRef.current.addEventListener('keydown', onKeyPress);
            removeEventListener = () => {
                // @ts-ignore
                inputRef.current.removeEventListener('keydown', onKeyPress);
                removeEventListener = null;
            };
        }
        catch (err) {
            // Noop.
        }
    }, [inputRef]);
    return (React.createElement("div", { className: 'screeps-console__input' },
        React.createElement("form", { onSubmit: onSubmit },
            React.createElement("fieldset", { className: 'screeps-field' },
                React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'Command... ', ref: inputRef, autoComplete: '', onChange: onChange, 
                    // onKeyDown={ onKeyPress } // Doesn't work
                    tabIndex: 0, value: value }),
                React.createElement("div", { className: 'underline' })))));
    function onKeyPress({ key }) {
        switch (key) {
            case 'ArrowUp': {
                historyUp();
                break;
            }
            case 'ArrowDown': {
                historyDown();
                break;
            }
        }
    }
    function historyUp() {
        if (historyIndex >= (history.length - 1)) {
            return;
        }
        setHistoryIndex(historyIndex + 1);
    }
    function historyDown() {
        if (historyIndex < 0) {
            return;
        }
        setHistoryIndex(historyIndex - 1);
    }
    function onChange(event) {
        const target = event.target;
        const value = target.value;
        setValue(value);
    }
    function onSubmit(event) {
        if (!value) {
            return;
        }
        onInput && onInput(value);
        setValue('');
        setHistory([value, ...history]);
        setHistoryIndex(-1);
        event.preventDefault();
    }
}
exports.default = default_1;
//# sourceMappingURL=console-input.js.map