"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const controls_1 = require("./components/controls");
const main_1 = require("./components/main");
const segments_1 = require("./components/segments");
class MemoryView extends React.Component {
    constructor(props) {
        super(props);
        this._shards$ = null;
        this.onClose = () => {
            this.props.onClose && this.props.onClose();
        };
        this.onResizeStart = (event) => {
            this.props.onResizeStart && this.props.onResizeStart(event);
        };
        this.onToggleView = ({ view }) => {
            console.log(view);
            this.setState(Object.assign({}, this.state, { view }));
        };
        this.state = {
            shards: [],
            view: 'main'
        };
    }
    componentDidMount() {
        this._shards$ = this.props.shards.subscribe((shards) => {
            this.setState(Object.assign({}, this.state, { shards }));
        });
    }
    render() {
        let view;
        if (this.state.view === 'main') {
            view = (React.createElement(main_1.default, { watches: this.props.watches }));
        }
        if (this.state.view === 'segments') {
            view = (React.createElement(segments_1.default, null));
        }
        return (React.createElement("div", { className: 'screeps-ide screeps-memory screeps-memory__view' },
            React.createElement("div", { className: 'panel-divider', onMouseDown: this.onResizeStart }),
            React.createElement(controls_1.default, { shards: this.state.shards, onClose: this.onClose, onToggleView: this.onToggleView }),
            React.createElement("hr", { className: 'screeps-hr' }),
            view));
    }
}
exports.default = MemoryView;
//# sourceMappingURL=index.js.map