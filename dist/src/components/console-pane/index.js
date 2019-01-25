"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
let clientY;
const userId = '5a58af97d870324d18b43f02';
class ConsolePane {
    constructor(_api, _socket, _service) {
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
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
            console.log(123, shard);
            this.shard = shard;
        };
        this.onClose = () => {
            this._panel.destroy();
        };
        this.onResizeStart = (event) => {
            clientY = event.clientY;
            document.addEventListener('mousemove', this.onResize);
            document.addEventListener('mouseup', this.onResizeStop);
        };
        this.onResize = (event) => {
            const offsetY = event.clientY - clientY;
            clientY = event.clientY;
            //@ts-ignore
            const height = parseInt(this.element.style.height, 10);
            this.element.style.height = `${height - offsetY}px`;
        };
        this.onResizeStop = () => {
            document.removeEventListener('mousemove', this.onResize);
            document.removeEventListener('mouseup', this.onResizeStop);
        };
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.consolePipe$ = this._socket.on(`user:${userId}/console`);
        this.render({});
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.ConsoleView, { output: this.consolePipe$, shards: this._service.shards$, onShard: this.onShard, onInput: this.onInput, onClose: this.onClose, onResizeStart: this.onResizeStart }), this.element);
    }
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