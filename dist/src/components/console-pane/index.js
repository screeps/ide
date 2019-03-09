"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
class ConsolePane {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
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
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.ConsoleView, { output: this.consolePipe$, shard: this.shard, shards: this._service.shards$, onShard: this.onShard, onInput: this.onInput, onClose: this.onClose })), this.element);
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
exports.ConsolePane = ConsolePane;
//# sourceMappingURL=index.js.map