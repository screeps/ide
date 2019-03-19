"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const pako = require('pako');
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ui_1 = require("../../../ui");
const utils_1 = require("../../utils");
const decoratos_1 = require("../../decoratos");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
class MemoryPanel {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
        this.viewRef = React.createRef();
        this._memorySbj = new rxjs_1.Subject();
        this.memory$ = this._memorySbj.asObservable();
        this._tooltips = {};
        this._tooltipsDisposables = null;
        this._pipe$ = null;
        this._eventsSbj = new rxjs_1.Subject();
        this.events$ = this._eventsSbj.asObservable();
        // Private component actions.
        this.onInput = (path) => {
            if (!this.viewRef.current) {
                return;
            }
            const memory = [...this.viewRef.current.state.memory, { path }];
            this._memorySbj.next(memory);
            utils_1.putWatches(memory);
            this.initMemoryPipeSubscription();
        };
        this.onClose = () => {
            if (this._pipe$) {
                this._pipe$.unsubscribe();
            }
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
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
        this._panel.onDidDestroy(() => {
            this._eventsSbj.next({ type: exports.ACTION_CLOSE });
        });
        this.initMemoryPipeSubscription();
        this._service.shards$
            .pipe(operators_1.tap((shards) => {
            if (!this.viewRef.current) {
                return;
            }
            this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { shards }));
        }))
            .subscribe();
        const subscriptions = new atom_1.CompositeDisposable();
        this.memory$
            .pipe(operators_1.tap((memory) => {
            if (!this.viewRef.current) {
                return;
            }
            this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { memory }));
        }))
            .pipe(operators_1.tap(() => {
            subscriptions.dispose();
        }))
            .pipe(operators_1.tap((memory) => {
            memory.forEach(({ path }) => {
                const ref = document.getElementById(`${ui_1.PATH_BTN_REMOVE}${path || 'root'}`);
                if (!ref) {
                    return;
                }
                const disposable = atom.tooltips.add(ref, {
                    title: 'Delete watch'
                });
                subscriptions.add(disposable);
            });
        }))
            .subscribe();
        this._applyTooltips();
    }
    get isVisible() {
        if (!this._panel) {
            return false;
        }
        return this._panel.isVisible();
    }
    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.unsubscribe();
        }
        if (!this.viewRef.current) {
            return;
        }
        const state = this.viewRef.current.state;
        const memory = utils_1.getWatches();
        const paths$ = [];
        memory.forEach(({ path }) => {
            const pipe = this._socket.on(`user:${this._user.id}/memory/${state.shard}/${path}`);
            paths$.push(pipe);
        });
        const pipe$ = rxjs_1.merge(...paths$);
        this._pipe$ = pipe$.subscribe(({ data: [channel, value] }) => {
            const [, , , _path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);
            if (!this.viewRef.current) {
                return;
            }
            const memory = this.viewRef.current.state.memory;
            const path = memory.find(({ path }) => path === _path);
            if (!path || path.value === value) {
                return;
            }
            // Check value for undefined, if undefined return
            if (path.value && path.value.toString() === value) {
                return;
            }
            const idx = this.viewRef.current.state.memory.indexOf(path);
            memory[idx] = Object.assign({}, path, { value });
            this._memorySbj.next([...memory]);
        });
    }
    render({ shard, memory, segment }) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.MemoryView, { ref: this.viewRef, onInput: this.onInput, onClose: this.onClose, shard: shard, onShard: () => this.onShard(), memory: memory, onMemory: (...args) => this.onMemory(...args), onMemoryRefresh: (...args) => this.onMemory(...args), onMemoryRemove: (...args) => this.onMemoryRemove(...args), onMemoryDelete: (...args) => this.onMemoryDelete(...args), onMemoryUpdate: (...args) => this.onMemoryUpdate(...args), onMemoryCancel: (...args) => this.onMemoryCancel(...args), segment: segment, onSegment: (...args) => this.onSegment(...args), onSegmentRefresh: (...args) => this.onSegment(...args), onSegmentUpdate: (...args) => this.onSegmentUpdate(...args) })), this.element);
    }
    async onMemory(path, shard) {
        let response;
        try {
            response = await this._api.getUserMemory({ path, shard });
        }
        catch (err) {
            return;
        }
        if (!this.viewRef.current) {
            return;
        }
        let value;
        if (response.data) {
            value = JSON.parse(pako.ungzip(atob(response.data.substring(3)), { to: 'string' }));
        }
        const memory = this.viewRef.current.state.memory;
        const idx = memory.findIndex((item) => item.path === path);
        if (idx === -1) {
            return;
        }
        memory[idx] = { path, value };
        this._memorySbj.next([...memory]);
        setTimeout(() => {
            if (this._tooltips[path]) {
                this.onMemoryCancel(path);
            }
            const subscriptions = this._tooltips[path] = new atom_1.CompositeDisposable();
            let ref = document.getElementById(`${ui_1.PATH_BTN_DELETE}${path || 'root'}`);
            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Delete from memory' });
                subscriptions.add(disposable);
            }
            ref = document.getElementById(`${ui_1.PATH_BTN_UPDATE}${path || 'root'}`);
            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Save' });
                subscriptions.add(disposable);
            }
            ref = document.getElementById(`${ui_1.PATH_BTN_RELOAD}${path || 'root'}`);
            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Reload' });
                subscriptions.add(disposable);
            }
            ref = document.getElementById(`${ui_1.PATH_BTN_CANCEL}${path || 'root'}`);
            if (ref) {
                const disposable = atom.tooltips.add(ref, { title: 'Cancel changes' });
                subscriptions.add(disposable);
            }
        });
    }
    async onMemoryUpdate(path, value, shard) {
        try {
            await this._api.setUserMemory({ path, value, shard });
        }
        catch (err) {
            return;
        }
        if (!this.viewRef.current) {
            return;
        }
        const memory = this.viewRef.current.state.memory;
        const idx = memory.findIndex((item) => item.path === path);
        if (idx === -1) {
            return;
        }
        memory[idx] = { path, value };
        this._memorySbj.next([...memory]);
    }
    async onMemoryRemove(path, shard) {
        try {
            await this._api.setUserMemory({ path, shard });
        }
        catch (err) {
            return;
        }
        if (!this.viewRef.current) {
            return;
        }
    }
    async onMemoryDelete(path) {
        if (!this.viewRef.current) {
            return;
        }
        const memory = this.viewRef.current.state.memory;
        const idx = memory.findIndex((item) => item.path === path);
        if (idx === -1) {
            return;
        }
        memory.splice(idx, 1);
        this._memorySbj.next([...memory]);
        utils_1.putWatches(memory);
        this.initMemoryPipeSubscription();
    }
    async onMemoryCancel(path) {
        this._tooltips[path].dispose();
        delete this._tooltips[path];
    }
    async onSegment(segment, shard) {
        let response;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard });
        }
        catch (err) {
            return;
        }
        if (!this.viewRef.current) {
            return;
        }
        this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { segmentData: response.data, _segmentData: response.data, segmentHasChange: false }));
    }
    async onSegmentUpdate(segment, data, shard) {
        try {
            await this._api.setUserMemorySegment({ segment, data, shard });
        }
        catch (err) {
            return;
        }
        if (!this.viewRef.current) {
            return;
        }
        this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { segmentData: data, _segmentData: data, segmentHasChange: false }));
    }
    show() {
        this._panel.show();
    }
    hide() {
        this._panel.hide();
    }
    _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }
            this._tooltipsDisposables = new atom_1.CompositeDisposable();
            const showMainMemoryBtnRef = document.getElementById('screeps-memory__control-main');
            if (showMainMemoryBtnRef) {
                const disposable = atom.tooltips.add(showMainMemoryBtnRef, { title: 'Main memory' });
                this._tooltipsDisposables.add(disposable);
            }
            const showSegmentsMemoryBtnRef = document.getElementById('screeps-memory__control-segments');
            if (showSegmentsMemoryBtnRef) {
                const disposable = atom.tooltips.add(showSegmentsMemoryBtnRef, { title: 'Segments memory' });
                this._tooltipsDisposables.add(disposable);
            }
            const closeMemoryBtnRef = document.getElementById('screeps-memory__control-close');
            if (closeMemoryBtnRef) {
                const disposable = atom.tooltips.add(closeMemoryBtnRef, { title: 'Close panel' });
                this._tooltipsDisposables.add(disposable);
            }
        });
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
    decoratos_1.progress
], MemoryPanel.prototype, "onMemory", null);
tslib_1.__decorate([
    decoratos_1.progress
], MemoryPanel.prototype, "onMemoryUpdate", null);
tslib_1.__decorate([
    decoratos_1.progress
], MemoryPanel.prototype, "onMemoryRemove", null);
tslib_1.__decorate([
    decoratos_1.progress
], MemoryPanel.prototype, "onMemoryDelete", null);
tslib_1.__decorate([
    decoratos_1.progress
], MemoryPanel.prototype, "onSegment", null);
tslib_1.__decorate([
    decoratos_1.progress
], MemoryPanel.prototype, "onSegmentUpdate", null);
exports.MemoryPanel = MemoryPanel;
//# sourceMappingURL=index.js.map