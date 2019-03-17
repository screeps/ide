"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
class ConsolePanel {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
        this._eventsSbj = new rxjs_1.Subject();
        this.events$ = this._eventsSbj.asObservable();
        // Private component actions.
        this.onInput = async ({ expression }) => {
            try {
                const data = await this._api.sendUserConsole({
                    expression,
                    shard: this.shard
                });
                console.log(data);
            }
            catch (err) {
                console.log(err);
            }
        };
        this.onShard = (shard) => {
            this.shard = shard;
        };
        this.onClose = () => {
            this._panel.destroy();
        };
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.shard = this._user.shard;
        this.consolePipe$ = this._socket.on(`user:${this._user.id}/console`);
        this.render({});
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
        this._panel.onDidDestroy(() => {
            this._eventsSbj.next({ type: exports.ACTION_CLOSE });
        });
    }
    get isVisible() {
        if (!this._panel) {
            return false;
        }
        return this._panel.isVisible();
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.ConsoleView, { output: this.consolePipe$, shard: this.shard, shards: this._service.shards$, onShard: this.onShard, onInput: this.onInput, onClose: this.onClose })), this.element);
    }
    show() {
        this._panel.show();
    }
    hide() {
        this._panel.hide();
    }
    // Atom pane required interface's methods
    getURI() {
        return 'atom://screeps-ide-console-view';
    }
    getTitle() {
        return '';
    }
    isPermanentDockItem() {
        return true;
    }
    getAllowedLocations() {
        return ['top'];
    }
}
exports.ConsolePanel = ConsolePanel;
//# sourceMappingURL=index.js.map