"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ConsoleInputView extends React.Component {
    constructor(props) {
        super(props);
        this._inputRef = React.createRef();
        this._history = [];
        this._historyIndex = 0;
        this.onKeyUpHandler = (event) => {
            console.log(event.key, this._historyIndex);
            if (event.key !== 'ArrowUp') {
                return;
            }
            if (!this._inputRef.current) {
                return;
            }
            if (this._historyIndex < this._history.length - 1) {
                this._historyIndex++;
                this._inputRef.current.value = this._history[this._historyIndex];
                return;
            }
            this._inputRef.current.value = '';
            this._historyIndex = this._history.length;
        };
        this.onKeyDownHandler = (event) => {
            console.log(event.key, this._historyIndex);
            if (event.key !== 'ArrowDown') {
                return;
            }
            if (!this._inputRef.current) {
                return;
            }
            if (this._historyIndex > 0) {
                this._historyIndex--;
                this._inputRef.current.value = this._history[this._historyIndex];
                return;
            }
            this._inputRef.current.value = '';
            this._historyIndex = -1;
        };
        this.onKeyPressHandler = (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            if (!event.target.value) {
                return;
            }
            this.props.onInput && this.props.onInput(event.target.value);
            this._history.unshift(event.target.value);
            event.target.value = '';
            this._historyIndex = -1;
        };
        this.onSubmit = (event) => {
            event.preventDefault();
        };
    }
    componentDidMount() {
        if (!this._inputRef.current) {
            return;
        }
        this._inputRef.current.addEventListener('keyup', this.onKeyUpHandler);
        this._inputRef.current.addEventListener('keydown', this.onKeyDownHandler);
    }
    render() {
        return (React.createElement("div", { className: 'screeps-console__input' },
            React.createElement("form", { onSubmit: this.onSubmit },
                React.createElement("fieldset", { className: 'screeps-field' },
                    React.createElement("input", { className: 'native-key-bindings', type: 'text', placeholder: 'Command...', ref: this._inputRef, autoComplete: '', onKeyPress: this.onKeyPressHandler, tabIndex: 0 }),
                    React.createElement("div", { className: 'underline' })))));
    }
}
exports.default = ConsoleInputView;
//# sourceMappingURL=console-input.js.map