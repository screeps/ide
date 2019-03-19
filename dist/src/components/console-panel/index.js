"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const React = require("react");
const ReactDOM = require("react-dom");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ui_1 = require("../../../ui");
exports.ACTION_CLOSE = 'ACTION_CLOSE';
class ConsolePanel {
    constructor(_user, _api, _socket, _service) {
        this._user = _user;
        this._api = _api;
        this._socket = _socket;
        this._service = _service;
        this.viewRef = React.createRef();
        this._eventsSbj = new rxjs_1.Subject();
        this.events$ = this._eventsSbj.asObservable();
        this._console$ = null;
        this._tooltipsDisposables = null;
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.render({
            shard: this._user.shard
        });
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
        this._panel.onDidDestroy(() => {
            this._eventsSbj.next({ type: exports.ACTION_CLOSE });
        });
        this._service.shards$
            .pipe(operators_1.tap((shards) => {
            if (!this.viewRef.current) {
                return;
            }
            this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { shards }));
        }))
            .subscribe();
        this.onResume();
    }
    get isVisible() {
        if (!this._panel) {
            return false;
        }
        return this._panel.isVisible();
    }
    render({ shard }) {
        ReactDOM.render(React.createElement(ui_1.ResizablePanel, null,
            React.createElement(ui_1.ConsoleView, { ref: this.viewRef, shard: shard, onShard: () => this.onShard(), onInput: (expression) => this.onInput(expression), onClose: () => this.onClose(), onPause: () => this.onPause(), onResume: () => this.onResume() })), this.element);
    }
    // Private component actions.
    async onInput(expression) {
        if (!this.viewRef.current) {
            return;
        }
        const msg = {
            log: expression
        };
        if (!this.viewRef.current) {
            return;
        }
        this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { messages: [...this.viewRef.current.state.messages, msg] }));
        try {
            await this._api.sendUserConsole({
                expression,
                shard: this.viewRef.current.state.shard
            });
        }
        catch (err) {
            // Noop.
        }
    }
    async onShard() {
    }
    async onClose() {
        if (this._console$) {
            this._console$.unsubscribe();
            this._console$ = null;
        }
        if (this._tooltipsDisposables) {
            this._tooltipsDisposables.dispose();
        }
        this._panel.destroy();
    }
    async onPause() {
        if (this._console$) {
            this._console$.unsubscribe();
            this._console$ = null;
        }
        this._applyTooltips();
    }
    async onResume() {
        this.onPause();
        this._console$ = this._socket.on(`user:${this._user.id}/console`)
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
            if (!this.viewRef.current) {
                return;
            }
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
            if (msg.data[1].error) {
                messages.push({
                    error: msg.data[1].error,
                    timeStamp,
                    shard
                });
            }
            this.viewRef.current.setState(Object.assign({}, this.viewRef.current.state, { messages: [...this.viewRef.current.state.messages, ...messages] }));
        }))
            .subscribe();
        this._applyTooltips();
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
            const clearConsoleBtnRef = document.getElementById('screeps-console__delete');
            if (clearConsoleBtnRef) {
                const disposable = atom.tooltips.add(clearConsoleBtnRef, { title: 'Clear' });
                this._tooltipsDisposables.add(disposable);
            }
            const closeConsoleBtnRef = document.getElementById('screeps-console__close');
            if (closeConsoleBtnRef) {
                const disposable = atom.tooltips.add(closeConsoleBtnRef, { title: 'Close panel' });
                this._tooltipsDisposables.add(disposable);
            }
            const pauseConsoleBtnRef = document.getElementById('screeps-console__pause');
            if (pauseConsoleBtnRef) {
                const disposable = atom.tooltips.add(pauseConsoleBtnRef, { title: 'Pause tracking' });
                this._tooltipsDisposables.add(disposable);
            }
            const playConsoleBtnRef = document.getElementById('screeps-console__play');
            if (playConsoleBtnRef) {
                const disposable = atom.tooltips.add(playConsoleBtnRef, { title: 'Resume tracking' });
                this._tooltipsDisposables.add(disposable);
            }
        });
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