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
        this._pipe$ = null;
        this.segment = '0';
        // Private component actions.
        this.onInput = ({ expression: path }) => {
            if (!this.memoryViewRef.current) {
                return;
            }
            const watches = [...this.memoryViewRef.current.state.watches, { path }];
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches }));
            utils_1.putWatches(watches);
            this.watches = watches;
            this.initMemoryPipeSubscription();
        };
        this.onDelete = (path) => {
            if (!this.memoryViewRef.current) {
                return;
            }
            const watches = this.memoryViewRef.current.state.watches;
            const watch = watches.find((item) => item.path === path);
            const idx = watches.indexOf(watch);
            watches.splice(idx, 1);
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
            utils_1.putWatches(watches);
            this.watches = watches;
            this.initMemoryPipeSubscription();
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
        this.onShard = (shard) => {
            this.shard = shard;
            this.onSegment(this.segment);
        };
        this.onSegment = (segment) => {
            this.segment = segment;
            this._api.getUserMemorySegment({ segment, shard: this.shard })
                .then(({ data }) => {
                if (!this.memoryViewRef.current) {
                    return;
                }
                this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { segmentData: data, _segmentData: data, segmentHasChange: false }));
            });
        };
        this.onSegmentUpdate = (data) => {
            this._api.setUserMemorySegment({ data, segment: this.segment, shard: this.shard });
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
        this.initMemoryPipeSubscription();
        this.render({});
        this.onSegment(this.segment);
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }
    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }
        const watches$ = [];
        this.watches.forEach((item) => {
            const pipe = this._socket.on(`user:${this._user.id}/memory/${this.shard}/${item.path}`);
            watches$.push(pipe);
        });
        this.pipe$ = rxjs_1.merge(...watches$);
        this._pipe$ = this.pipe$.subscribe(({ data: [channel, value] }) => {
            const [, , , path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);
            if (!this.memoryViewRef.current) {
                return;
            }
            const watches = this.memoryViewRef.current.state.watches;
            const watch = watches.find((item) => item.path === path);
            const idx = this.memoryViewRef.current.state.watches.indexOf(watch);
            watches[idx] = Object.assign({}, Object.assign({}, watch, { value }));
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
        });
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.MemoryView, { ref: this.memoryViewRef, pipe: this.pipe$, shard: this.shard, shards: this._service.shards$, watches: this.watches, onInput: this.onInput, onDelete: this.onDelete, onClick: this.getUserMemory, onClose: this.onClose, onResizeStart: this.onResizeStart, onShard: this.onShard, segment: this.segment, onSegment: this.onSegment, onSegmentRefresh: this.onSegment, onSegmentUpdate: this.onSegmentUpdate }), this.element);
    }
    // Atom pane required interface's methods
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