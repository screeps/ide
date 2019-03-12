"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pako = require('pako');
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const ui_1 = require("../../../ui");
const utils_1 = require("../../utils");
let animationStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
// @ts-ignore
function progress(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        this.showProgress();
        let result;
        try {
            result = await original.apply(this, args);
        }
        catch (err) {
            // Noop.
        }
        this.hideProgress();
        return result;
    };
    return descriptor;
}
class MemoryPane {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
        this.memoryViewRef = React.createRef();
        this._pipe$ = null;
        // Private component actions.
        this.onInput = (path) => {
            if (!this.memoryViewRef.current) {
                return;
            }
            const memory = [...this.memoryViewRef.current.state.memory, { path }];
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { memory }));
            utils_1.putWatches(memory);
            this.initMemoryPipeSubscription();
        };
        this.onClose = () => {
            if (this._pipe$) {
                this._pipe$.unsubscribe();
            }
            this._panel.destroy();
        };
        this.onShard = async () => {
            this.initMemoryPipeSubscription();
        };
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.render({
            shard: this._user.shard,
            memory: utils_1.getWatches(),
            segment: '0'
        });
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
        this.initMemoryPipeSubscription();
        this._service.shards$.subscribe((shards) => {
            if (!this.memoryViewRef.current) {
                return;
            }
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { shards }));
        });
    }
    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }
        if (!this.memoryViewRef.current) {
            return;
        }
        const state = this.memoryViewRef.current.state;
        const memory = utils_1.getWatches();
        const paths$ = [];
        memory.forEach(({ path }) => {
            const pipe = this._socket.on(`user:${this._user.id}/memory/${state.shard}/${path}`);
            paths$.push(pipe);
        });
        const pipe$ = rxjs_1.merge(...paths$);
        this._pipe$ = pipe$.subscribe(({ data: [channel, value] }) => {
            const [, , , _path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);
            if (!this.memoryViewRef.current) {
                return;
            }
            const memory = this.memoryViewRef.current.state.memory;
            const path = memory.find(({ path }) => path === _path);
            if (!path || path.value === value) {
                return;
            }
            // Check value for undefined, if undefined return
            if (path.value && path.value.toString() === value) {
                return;
            }
            const idx = this.memoryViewRef.current.state.memory.indexOf(path);
            memory[idx] = Object.assign({}, Object.assign({}, path, { value }));
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { memory: [...memory] }));
        });
    }
    render({ shard, memory, segment }) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.MemoryView, { ref: this.memoryViewRef, onInput: this.onInput, onClose: this.onClose, shard: shard, onShard: () => this.onShard(), memory: memory, onMemory: (...args) => this.onMemory(...args), onMemoryRefresh: (...args) => this.onMemory(...args), onMemoryRemove: (...args) => this.onMemoryRemove(...args), onMemoryDelete: (...args) => this.onMemoryDelete(...args), onMemoryUpdate: (...args) => this.onMemoryUpdate(...args), segment: segment, onSegment: (...args) => this.onSegment(...args), onSegmentRefresh: (...args) => this.onSegment(...args), onSegmentUpdate: (...args) => this.onSegmentUpdate(...args) })), this.element);
    }
    async onMemory(path, shard) {
        let response;
        try {
            response = await this._api.getUserMemory({ path, shard });
        }
        catch (err) {
            return;
        }
        if (!this.memoryViewRef.current) {
            return;
        }
        let value;
        if (response.data) {
            value = JSON.parse(pako.ungzip(atob(response.data.substring(3)), { to: 'string' }));
        }
        const watches = this.memoryViewRef.current.state.memory;
        const watch = watches.find((item) => item.path === path);
        if (!watch) {
            return;
        }
        const idx = watches.indexOf(watch);
        watches[idx] = Object.assign({}, watch, { value });
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { memory: [...watches] }));
    }
    async onMemoryUpdate(path, value, shard) {
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, value, shard });
            this.hideProgress();
        }
        catch (err) {
            return;
        }
        if (!this.memoryViewRef.current) {
            return;
        }
        const watches = this.memoryViewRef.current.state.memory;
        const watch = watches.find((item) => item.path === path);
        if (!watch) {
            return;
        }
        const idx = watches.indexOf(watch);
        watches[idx] = Object.assign({}, watch, { value });
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { memory: [...watches] }));
    }
    async onMemoryRemove(path, shard) {
        this.showProgress();
        try {
            await this._api.setUserMemory({ path, shard });
            this.hideProgress();
        }
        catch (err) {
            return;
        }
        if (!this.memoryViewRef.current) {
            return;
        }
    }
    async onMemoryDelete(path) {
        if (!this.memoryViewRef.current) {
            return;
        }
        const watches = this.memoryViewRef.current.state.memory;
        const watch = watches.find((item) => item.path === path);
        if (!watch) {
            return;
        }
        const idx = watches.indexOf(watch);
        watches.splice(idx, 1);
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { memory: [...watches] }));
        utils_1.putWatches(watches);
        this.initMemoryPipeSubscription();
    }
    async onSegment(segment, shard) {
        let response;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard });
        }
        catch (err) {
            return;
        }
        if (!this.memoryViewRef.current) {
            return;
        }
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { segmentData: response.data, _segmentData: response.data, segmentHasChange: false }));
    }
    async onSegmentUpdate(segment, data, shard) {
        try {
            await this._api.setUserMemorySegment({ segment, data, shard });
        }
        catch (err) {
            return;
        }
        if (!this.memoryViewRef.current) {
            return;
        }
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state, { segmentData: data, _segmentData: data, segmentHasChange: false }));
    }
    showProgress() {
        animationStartTime = new Date().getTime();
        if (!this.memoryViewRef.current) {
            return;
        }
        this.memoryViewRef.current.state.isProgressing = true;
        this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state));
    }
    hideProgress() {
        const now = new Date().getTime();
        const delay = ANIMATION_MIN_TIME - (now - animationStartTime);
        setTimeout(() => {
            if (!this.memoryViewRef.current) {
                return;
            }
            this.memoryViewRef.current.state.isProgressing = false;
            this.memoryViewRef.current.setState(Object.assign({}, this.memoryViewRef.current.state));
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
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onMemory", null);
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onMemoryUpdate", null);
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onMemoryRemove", null);
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onMemoryDelete", null);
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onSegment", null);
tslib_1.__decorate([
    progress
], MemoryPane.prototype, "onSegmentUpdate", null);
exports.MemoryPane = MemoryPane;
//# sourceMappingURL=index.js.map