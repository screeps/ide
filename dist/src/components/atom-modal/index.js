"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
class AtomModal {
    constructor(Component, props = {}) {
        this._eventsSbj = new rxjs_1.Subject();
        this._ref = React.createRef();
        this.onEscape = (event) => {
            if (event.code !== 'Escape') {
                return;
            }
            this.onCancel();
        };
        this.onCancel = () => {
            this._eventsSbj.next({ type: 'MODAL_CANCEL' });
            this.destroy();
        };
        this.onSubmit = (payload) => {
            this._eventsSbj.next({ type: 'MODAL_SUBMIT', payload });
        };
        this._element = document.createElement('div');
        this.events$ = this._eventsSbj.asObservable();
        setTimeout(() => {
            this._atomModalPanelRef = atom.workspace.addModalPanel({
                item: this._element,
                visible: true
            });
            document.body.addEventListener('keyup', this.onEscape);
            ReactDOM.render(React.createElement(Component, Object.assign({ ref: this._ref }, props, { onCancel: this.onCancel, onSubmit: this.onSubmit })), this._element);
        });
    }
    get ref() {
        return this._ref.current;
    }
    hide() {
        this._atomModalPanelRef.hide();
    }
    destroy() {
        this._atomModalPanelRef.destroy();
        document.body.removeEventListener('keyup', this.onEscape);
    }
}
exports.AtomModal = AtomModal;
//# sourceMappingURL=index.js.map