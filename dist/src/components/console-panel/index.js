"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Panel, CompositeDisposable } from 'atom';
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ui_1 = require("../../../ui");
const service_1 = require("../../service");
const utils_1 = require("../../utils");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
exports.CONSOLE_URI = 'atom://screeps-ide/console';
class ConsolePanel {
    constructor(state = {}) {
        this._tooltipsDisposables = null;
        this._state = {
            messages: []
        };
        this.element = document.createElement('div');
        this.render(state);
        setTimeout(() => {
            const pane = atom.workspace.paneForItem(this);
            if (!pane) {
                return;
            }
            pane.onDidDestroy(() => this.destroy());
        });
        (async () => {
            try {
                this._api = await utils_1.getApi();
                this._user = await utils_1.getUser();
                this._socket = utils_1.getSocket();
                this._service = new service_1.Service();
                this.state = { shard: this._user.shard };
                this._service.shards$
                    .pipe(operators_1.tap((shards) => this.state = { shards }))
                    .subscribe();
                this.onResume();
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
    render({ shard, shards, messages = [] }) {
        ReactDOM.render(
        // @ts-ignore
        React.createElement(ui_1.ConsoleView, { ref: this.viewRef, shard: shard, shards: shards, messages: messages, onShard: (shard) => this.onShard(shard), onInput: (expression) => this.onInput(expression), onClose: () => this.onClose(), onPause: () => this.onPause(), onResume: () => this.onResume(), onClean: () => this.onClean() }), this.element);
    }
    // Private component actions.
    async onInput(expression) {
        const messages = [...this.state.messages, { expression }];
        this.state = { messages };
        try {
            await this._api.sendUserConsole({
                expression,
                shard: this.state.shard
            });
        }
        catch (err) {
            // Noop.
        }
    }
    async onShard(shard) {
        this.state = { shard };
    }
    async onClose() {
        this.destroy();
    }
    async onPause() {
        if (this._console$) {
            this._console$.next();
            this._console$.complete();
            this._console$ = null;
        }
        this._applyTooltips();
    }
    async onResume() {
        this.onPause();
        this._console$ = new rxjs_1.Subject();
        this._socket.on(`user:${this._user.id}/console`)
            .pipe(operators_1.takeUntil(this._console$))
            .pipe(operators_1.filter((msg) => {
            if (msg.data && msg.data[1].messages && msg.data[1].messages.log.length) {
                return true;
            }
            if (msg.data && msg.data[1].error) {
                return true;
            }
            return false;
        }))
            .pipe(operators_1.tap((msg) => {
            const timeStamp = msg.timeStamp;
            const shard = msg.data[1].shard;
            const messages = [];
            try {
                msg.data[1].messages.log.reduce((messages, log) => {
                    messages.push({
                        log,
                        timeStamp,
                        shard
                    });
                    return messages;
                }, messages);
            }
            catch (err) {
                // Noop.
            }
            try {
                msg.data[1].messages.results.reduce((messages, result) => {
                    messages.push({
                        result
                    });
                    return messages;
                }, messages);
            }
            catch (err) {
                // Noop.
            }
            if (msg.data[1].error) {
                messages.push({
                    error: msg.data[1].error,
                    timeStamp,
                    shard
                });
            }
            this.state = {
                messages: [...this.state.messages, ...messages].slice(-100)
            };
        }))
            .subscribe(undefined, undefined, () => {
            this._socket.off(`user:${this._user.id}/console`);
        });
        this._applyTooltips();
    }
    async onClean() {
        this.state = {
            messages: []
        };
    }
    _applyTooltips() {
        setTimeout(() => {
            if (this._tooltipsDisposables) {
                this._tooltipsDisposables.dispose();
            }
            let d;
            const subscriptions = this._tooltipsDisposables = new atom_1.CompositeDisposable();
            d = utils_1.applyTooltip('#screeps-console__delete', 'Clear', this.element);
            d && subscriptions.add(d);
            d = utils_1.applyTooltip('#screeps-console__close', 'Close panel', this.element);
            d && subscriptions.add(d);
            d = utils_1.applyTooltip('#screeps-console__pause', 'Pause tracking', this.element);
            d && subscriptions.add(d);
            d = utils_1.applyTooltip('#screeps-console__play', 'Resume tracking', this.element);
            d && subscriptions.add(d);
        });
    }
    destroy() {
        if (this._console$) {
            this._console$.next();
            this._console$.complete();
            this._console$ = null;
        }
        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }
    }
    // Implement serialization hook for view model
    serialize() {
        return {
            deserializer: 'ConsolePanel',
            state: this.state
        };
    }
    static deserialize({ state }) {
        return new ConsolePanel(state);
    }
    // Atom pane required interface's methods
    getURI() {
        return exports.CONSOLE_URI;
    }
    getTitle() {
        return 'Console';
    }
    getAllowedLocations() {
        return ['bottom', 'top'];
    }
}
exports.ConsolePanel = ConsolePanel;
//# sourceMappingURL=index.js.map