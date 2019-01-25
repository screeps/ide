"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
class AtomModal {
    constructor(Component) {
        this._eventsSbj = new rxjs_1.Subject();
        this.onCancel = () => {
            this._eventsSbj.next({ type: 'AUTH_CANCEL ' });
            this._atomModalPanelRef.hide();
        };
        this.onSubmit = (payload) => {
            console.log(1, 'onSubmit', payload);
            this._eventsSbj.next({ type: 'AUTH_SUBMIT', payload });
        };
        this._element = document.createElement('div');
        this.events$ = this._eventsSbj.asObservable();
        ReactDOM.render(React.createElement(Component, { onCancel: this.onCancel, onSubmit: this.onSubmit }), this._element);
        this._atomModalPanelRef = atom.workspace.addModalPanel({
            item: this._element,
            visible: true
        });
    }
}
exports.AtomModal = AtomModal;
//# sourceMappingURL=index.js.map