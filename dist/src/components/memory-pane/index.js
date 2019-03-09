"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pako = require('pako');
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const utils_1 = require("../../utils");
let animationStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
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
        this.onShard = (shard) => {
            this.shard = shard;
            this.onSegment(this.segment);
        };
        this.onMemory = async (path) => {
            this.showProgress();
            let response;
            try {
                response = await this._api.getUserMemory({ path, shard: this.shard });
                this.hideProgress();
            }
            catch (err) {
                return;
            }
            if (!this.memoryViewRef.current) {
                return;
            }
            let data;
            if (response.data) {
                data = JSON.parse(pako.ungzip(atob(response.data.substring(3)), { to: 'string' }));
            }
            const watches = this.memoryViewRef.current.state.watches;
            const watch = watches.find((item) => item.path === path);
            const idx = watches.indexOf(watch);
            watches[idx] = Object.assign({}, watch, { data });
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
        };
        this.onMemoryUpdate = async (path, value) => {
            try {
                await this._api.setUserMemory({ path, value, shard: this.shard });
            }
            catch (err) {
                return;
            }
            if (!this.memoryViewRef.current) {
                return;
            }
            const watches = this.memoryViewRef.current.state.watches;
            const watch = watches.find((item) => item.path === path);
            const idx = this.memoryViewRef.current.state.watches.indexOf(watch);
            watches[idx] = Object.assign({}, watch, { data: value });
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
        };
        this.onSegment = async (segment) => {
            this.showProgress();
            this.segment = segment;
            let response;
            try {
                response = await this._api.getUserMemorySegment({ segment, shard: this.shard });
                this.hideProgress();
            }
            catch (err) {
                return;
            }
            if (!this.memoryViewRef.current) {
                return;
            }
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { segment, segmentData: response.data, _segmentData: response.data, segmentHasChange: false }));
        };
        this.onSegmentUpdate = async (data) => {
            this.showProgress();
            try {
                await this._api.setUserMemorySegment({ data, segment: this.segment, shard: this.shard });
                this.hideProgress();
            }
            catch (err) {
                //Noop.
            }
            if (!this.memoryViewRef.current) {
                return;
            }
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { segmentData: data, _segmentData: data, segmentHasChange: false }));
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
            if (watch.value === value) {
                return;
            }
            const idx = this.memoryViewRef.current.state.watches.indexOf(watch);
            watches[idx] = Object.assign({}, Object.assign({}, watch, { value }));
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { watches: [...watches] }));
        });
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.MemoryView, { ref: this.memoryViewRef, pipe: this.pipe$, onInput: this.onInput, onDelete: this.onDelete, onClose: this.onClose, watches: this.watches, onMemory: this.onMemory, onMemoryRefresh: this.onMemory, onMemoryUpdate: this.onMemoryUpdate, shard: this.shard, shards: this._service.shards$, onShard: this.onShard, segment: this.segment, onSegment: this.onSegment, onSegmentRefresh: this.onSegment, onSegmentUpdate: this.onSegmentUpdate })), this.element);
    }
    showProgress() {
        animationStartTime = new Date().getTime();
        if (!this.memoryViewRef.current) {
            return;
        }
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { isProgressing: true }));
    }
    hideProgress() {
        const now = new Date().getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);
        setTimeout(() => {
            if (!this.memoryViewRef.current) {
                return;
            }
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { isProgressing: false }));
        }, delay > 0 ? delay : 0);
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