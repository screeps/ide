"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const operators_1 = require("rxjs/operators");
const controls_1 = require("./components/controls");
const messages_list_1 = require("./components/messages-list");
const console_input_1 = require("./components/console-input");
class ConsoleView extends React.Component {
    constructor(props) {
        super(props);
        this._output$ = null;
        this._shards$ = null;
        this.onStart = () => {
            this._subscribe();
        };
        this.onPause = () => {
            this._unsubscribe();
        };
        this.onShard = (shard) => {
            this.props.onShard && this.props.onShard(shard);
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onDelete = () => {
            this.setState(Object.assign({}, this.state, { messages: [] }));
        };
        this.onInput = ({ expression }) => {
            this.pushMessage({
                data: [null, {
                        messages: {
                            log: [expression]
                        }
                    }]
            });
            this.props.onInput && this.props.onInput({ expression });
        };
        this.onResizeStart = (event) => {
            this.props.onResizeStart && this.props.onResizeStart(event);
        };
        this.state = {
            shard: props.shard,
            shards: [],
            paused: true,
            messages: []
        };
    }
    componentDidMount() {
        this._subscribe();
        this.setState(Object.assign({}, this.state, { shard: this.props.shard }));
        this._shards$ = this.props.shards.subscribe((shards) => {
            this.setState(Object.assign({}, this.state, { shards }));
        });
    }
    _subscribe() {
        this._output$ = this.props.output
            .pipe(operators_1.filter((msg) => {
            if (msg.data && msg.data[1].messages && msg.data[1].messages.log.length) {
                return true;
            }
            if (msg.data && msg.data[1].error) {
                return true;
            }
            return false;
        }))
            .subscribe((msg) => {
            this.pushMessage(msg);
        });
        this.setState(Object.assign({}, this.state, { paused: false }));
    }
    _unsubscribe() {
        if (!this._output$) {
            return;
        }
        this._output$.unsubscribe();
        this._output$ = null;
        this.setState(Object.assign({}, this.state, { paused: true }));
    }
    pushMessage(msg) {
        this.setState(Object.assign({}, this.state, { messages: [...this.state.messages, msg] }));
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-console screeps-console__view' },
            React.createElement("div", { className: 'panel-divider', onMouseDown: this.onResizeStart }),
            React.createElement(controls_1.default, { shard: this.state.shard, shards: this.state.shards, paused: this.state.paused, onShard: this.onShard, onStart: this.onStart, onPause: this.onPause, onClose: this.onClose, onDelete: this.onDelete }),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(messages_list_1.default, { messages: this.state.messages || [] }),
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(console_input_1.default, { onInput: this.onInput })));
    }
}
exports.default = ConsoleView;
//# sourceMappingURL=index.js.map