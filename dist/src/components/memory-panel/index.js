"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import { Panel, CompositeDisposable } from 'atom';
const atom_1 = require("atom");
const pako = require('pako');
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ui_1 = require("../../../ui");
const service_1 = require("../../service");
const utils_1 = require("../../utils");
const decoratos_1 = require("../../decoratos");
const utils_2 = require("../../utils");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
exports.MEMORY_URI = 'atom://screeps-ide/memory';
class MemoryPanel {
    constructor(state = {}) {
        this._memorySbj = new rxjs_1.Subject();
        this.memory$ = this._memorySbj.asObservable();
        this._tooltips = {};
        this._tooltipsDisposables = null;
        // public get state(): any {
        //     if (!this.viewRef.current) {
        //         return {
        //         };
        //     }
        //     // @ts-ignore
        //     return this.viewRef.current.state;
        // }
        // public set state(state: any) {
        //     if (!this.viewRef.current) {
        //         return;
        //     }
        //     // @ts-ignore
        //     this.viewRef.current.state = {
        //         // @ts-ignore
        //         ...this.viewRef.current.state,
        //         ...state
        //     };
        //     // @ts-ignore
        //     this.viewRef.current.setState(
        //         // @ts-ignore
        //         this.viewRef.current.state
        //     );
        // }
        this._state = {
            memory: utils_1.getWatches()
        };
        this.onChangeView = (view) => {
            this.state = { view };
            switch (this.state.view) {
                case ui_1.MEMORY_MAIN_VIEW: {
                    this.initMemoryPipeSubscription();
                    break;
                }
                case ui_1.MEMORY_SEGMENTS_VIEW: {
                    this.onSegment(this.state.segment, this.state.shard);
                    break;
                }
            }
        };
        // Private component actions.
        this.onInput = (path) => {
            const memory = [...this.state.memory, { path }];
            this._memorySbj.next(memory);
            utils_1.putWatches(memory);
            this.initMemoryPipeSubscription();
        };
        this.onClose = () => {
            this.destroy();
        };
        this.onShard = async (shard) => {
            this.state = { shard };
            this.onChangeView(this.state.view);
        };
        this.element = document.createElement('div');
        this.state = state;
        setTimeout(() => {
            const pane = atom.workspace.paneForItem(this);
            if (!pane) {
                return;
            }
            pane.onDidDestroy(() => this.destroy());
        });
        (async () => {
            try {
                this._api = await utils_2.getApi();
                this._user = await utils_2.getUser();
                this._socket = utils_2.getSocket();
                this._service = new service_1.Service();
                this.initMemoryPipeSubscription();
                this._service.shards$
                    .pipe(operators_1.tap((shards) => this.state = { shards }))
                    .subscribe();
                const subscriptions = new atom_1.CompositeDisposable();
                this.memory$
                    .pipe(operators_1.tap((memory) => this.state = { memory }))
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
            catch (err) {
                setTimeout(() => {
                    const pane = atom.workspace.paneForItem(this);
                    if (!pane) {
                        return;
                    }
                    pane.destroyItem(this);
                });
                this.destroy();
            }
        })();
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = Object.assign({}, this._state, state);
        this.render(this.state);
    }
    initMemoryPipeSubscription() {
        if (this._pipe$) {
            this._pipe$.next();
            this._pipe$.complete();
            this._pipe$ = null;
        }
        this._pipe$ = new rxjs_1.Subject();
        const { shard, memory } = this.state;
        const paths$ = memory.map(({ path }) => {
            return this._socket.on(`user:${this._user.id}/memory/${shard}/${path}`);
        });
        const pipe$ = rxjs_1.merge(...paths$);
        pipe$
            .pipe(operators_1.takeUntil(this._pipe$))
            .pipe(operators_1.tap(({ data: [channel, value] }) => {
            const [, , , _path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);
            const memory = this.state.memory;
            const path = memory.find(({ path }) => path === _path);
            if (!path || path.value === value) {
                return;
            }
            // Check value for undefined, if undefined return
            if (path.value && path.value.toString() === value) {
                return;
            }
            const idx = this.state.memory.indexOf(path);
            memory[idx] = Object.assign({}, path, { value });
            this._memorySbj.next([...memory]);
        }))
            .subscribe(undefined, undefined, () => {
            memory.forEach(({ path }) => {
                this._socket.off(`user:${this._user.id}/memory/${shard}/${path}`);
            });
        });
    }
    render({ view = '', shard = 'shard0', shards = [], memory = [], segment = '0', segmentData = '', isProgressing = false }) {
        ReactDOM.render(React.createElement(ui_1.MemoryView, { view: view, onChangeView: (view) => this.onChangeView(view), isProgressing: isProgressing, onInput: this.onInput, onClose: this.onClose, shard: shard, shards: shards, onShard: (shard) => this.onShard(shard), memory: memory, onMemory: (...args) => this.onMemory(...args), onMemoryRefresh: (...args) => this.onMemory(...args), onMemoryRemove: (...args) => this.onMemoryRemove(...args), onMemoryDelete: (...args) => this.onMemoryDelete(...args), onMemoryUpdate: (...args) => this.onMemoryUpdate(...args), onMemoryCancel: (...args) => this.onMemoryCancel(...args), segment: segment, segmentData: segmentData, onSegment: (...args) => this.onSegment(...args), onSegmentRefresh: (...args) => this.onSegment(...args), onSegmentUpdate: (...args) => this.onSegmentUpdate(...args) }), this.element);
    }
    async onMemory(path, shard) {
        let response;
        try {
            response = await this._api.getUserMemory({ path, shard });
        }
        catch (err) {
            return;
        }
        let value;
        if (response.data) {
            value = JSON.parse(pako.ungzip(atob(response.data.substring(3)), { to: 'string' }));
        }
        const memory = this.state.memory;
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
            let d;
            const subscriptions = this._tooltips[path] = new atom_1.CompositeDisposable();
            d = utils_2.applyTooltip(`#${ui_1.PATH_BTN_DELETE}${path || 'root'}`, 'Delete from memory');
            d && subscriptions.add(d);
            d = utils_2.applyTooltip(`#${ui_1.PATH_BTN_UPDATE}${path || 'root'}`, 'Save');
            d && subscriptions.add(d);
            d = utils_2.applyTooltip(`#${ui_1.PATH_BTN_RELOAD}${path || 'root'}`, 'Reload');
            d && subscriptions.add(d);
            d = utils_2.applyTooltip(`#${ui_1.PATH_BTN_CANCEL}${path || 'root'}`, 'Cancel changes');
            d && subscriptions.add(d);
        });
    }
    async onMemoryUpdate(path, value, shard) {
        try {
            await this._api.setUserMemory({ path, value, shard });
        }
        catch (err) {
            return;
        }
        const memory = this.state.memory;
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
    }
    async onMemoryDelete(path) {
        const memory = this.state.memory;
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
        this.state = {
            segment
        };
        let response;
        try {
            response = await this._api.getUserMemorySegment({ segment, shard });
        }
        catch (err) {
            return;
        }
        this.state = {
            segmentData: response.data
        };
    }
    async onSegmentUpdate(segment, data, shard) {
        try {
            await this._api.setUserMemorySegment({ segment, data, shard });
        }
        catch (err) {
            return;
        }
        this.state = {
            segmentData: data
        };
    }
    _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }
            let d;
            const subscriptions = this._tooltipsDisposables = new atom_1.CompositeDisposable();
            d = utils_2.applyTooltip('#screeps-memory__control-main', 'Main memory');
            d && subscriptions.add(d);
            d = utils_2.applyTooltip('#screeps-memory__control-segments', 'Segments memory');
            d && subscriptions.add(d);
            d = utils_2.applyTooltip('#screeps-memory__control-close', 'Close panel');
            d && subscriptions.add(d);
        });
    }
    destroy() {
        if (this._pipe$) {
            this._pipe$.next();
            this._pipe$.complete();
            this._pipe$ = null;
        }
        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }
    }
    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'MemoryPanel',
            state: this.state
        };
    }
    static deserialize({ state }) {
        return new MemoryPanel(state);
    }
    // Atom pane required interface's methods
    getURI() {
        return exports.MEMORY_URI;
    }
    getTitle() {
        return 'Memory';
    }
    getAllowedLocations() {
        return ['bottom', 'top'];
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