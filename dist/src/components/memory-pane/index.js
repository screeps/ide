"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pako = require('pako');
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const utils_1 = require("../../utils");
let clientY;
class MemoryPane {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
        this.memoryViewRef = React.createRef();
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
        this.getUserMemory = ({ path }) => {
            this._api.getUserMemory({ path, shard: this.shard })
                .then(({ data }) => {
                const __ = JSON.parse(pako.ungzip(atob(data.substring(3)), { to: 'string' }));
                if (!this.memoryViewRef.current) {
                    return;
                }
                const watches = this.memoryViewRef.current.state.watches;
                const watch = watches.find((item) => item.path === path);
                const idx = watches.indexOf(watch);
                watches[idx] = Object.assign({}, Object.assign({}, watch, { data: __ }));
                this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
            });
        };
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.shard = this._user.shard;
        this.watches = utils_1.getWatches();
        const watches$ = [];
        this.watches.forEach((item) => {
            const pipe = this._socket.on(`user:${this._user.id}/memory/${this.shard}/${item.path}`);
            watches$.push(pipe);
        });
        this.pipe$ = rxjs_1.merge(...watches$);
        this.render({});
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.MemoryView, { ref: this.memoryViewRef, pipe: this.pipe$, shard: this.shard, shards: this._service.shards$, watches: this.watches, onClick: this.getUserMemory, onClose: this.onClose, onResizeStart: this.onResizeStart }), this.element);
    }
    getURI() {
        return 'atom://screeps-ide-memory-view';
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
exports.MemoryPane = MemoryPane;
//# sourceMappingURL=index.js.map