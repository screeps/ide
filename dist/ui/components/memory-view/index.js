"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const controls_1 = require("./components/controls");
const main_1 = require("./components/main");
const segments_1 = require("./components/segments");
const input_1 = require("./components/input");
class MemoryView extends React.Component {
    constructor(props) {
        super(props);
        this._shards$ = null;
        this._pipe$ = null;
        this.onClick = (item) => {
            this.props.onClick && this.props.onClick(item);
        };
        this.onInput = (data) => {
            console.log('input', data);
        };
        this.onShard = (shard) => {
            this.props.onShard && this.props.onShard(shard);
        };
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onResizeStart = (event) => {
            this.props.onResizeStart && this.props.onResizeStart(event);
        };
        this.onToggleView = ({ view }) => {
            this.setState(Object.assign({}, this.state, { view }));
        };
        this.state = {
            shard: props.shard,
            shards: [],
            view: 'main',
            //@ts-ignore
            watches: this.props.watches
        };
    }
    componentDidMount() {
        if (this.props.pipe) {
            this.initMemoryPipeSubscription();
        }
        if (this.props.shards) {
            this.initShardsPipeSubscription();
        }
    }
    render() {
        let view;
        if (this.state.view === 'main') {
            view = (React.createElement(main_1.default, { watches: this.state.watches, onClick: this.onClick }));
        }
        if (this.state.view === 'segments') {
            view = (React.createElement(segments_1.default, null));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-memory screeps-memory__view' },
            React.createElement("div", { className: 'panel-divider', onMouseDown: this.onResizeStart }),
            React.createElement(controls_1.default, { shard: this.state.shard, shards: this.state.shards, onShard: this.onShard, onClose: this.onClose, onToggleView: this.onToggleView }),
            React.createElement("hr", { className: 'screeps-hr' }),
            view,
            React.createElement("hr", { className: 'screeps-hr' }),
            React.createElement(input_1.default, { onInput: this.onInput })));
    }
    initMemoryPipeSubscription() {
        this._pipe$ = this.props.pipe.subscribe(({ data: [channel, value] }) => {
            //user:5a58af97d870324d18b43f02/memory/shard3/rooms
            const [, , , path] = channel.match(/user\:(.+)\/memory\/(.+)\/(.+)/i);
            const watches = this.state.watches;
            const watch = watches.find((item) => item.path === path);
            const idx = this.state.watches.indexOf(watch);
            watches[idx] = Object.assign({}, Object.assign({}, watch, { value }));
            this.setState(Object.assign({}, this.state, { watches: [...watches] }));
        });
    }
    initShardsPipeSubscription() {
        this._shards$ = this.props.shards.subscribe((shards) => {
            this.setState(Object.assign({}, this.state, { shards }));
        });
    }
}
exports.default = MemoryView;
//# sourceMappingURL=index.js.map