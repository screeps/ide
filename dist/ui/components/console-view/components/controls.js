"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
function default_1({ shard, shards, paused: _paused, onShard: applyShard, onResume: resume, onPause: pause, onClean: clean, }) {
    const [paused, setPaused] = react_1.useState(_paused);
    let toggle;
    if (paused) {
        toggle = (React.createElement("button", { id: 'screeps-console__play', className: 'btn icon', onClick: onResume },
            React.createElement("i", { className: 'sc-icon-play' })));
    }
    else {
        toggle = (React.createElement("button", { id: 'screeps-console__pause', className: 'btn icon', onClick: onPause },
            React.createElement("i", { className: 'sc-icon-pause' })));
    }
    return (React.createElement("div", { className: 'screeps-console__controls' },
        React.createElement("div", { className: '' },
            React.createElement("select", { className: 'input-select', onChange: onShard, value: shard }, shards.map(({ name }) => {
                return (React.createElement("option", { key: name, value: name }, name));
            }))),
        React.createElement("div", { className: 'btn-group' },
            React.createElement("button", { id: 'screeps-console__delete', className: 'btn icon', onClick: onClean },
                React.createElement("i", { className: 'sc-icon-delete' })),
            toggle)));
    function onShard(event) {
        applyShard && applyShard(event.target.value);
    }
    function onPause() {
        setPaused(true);
        pause && pause();
    }
    function onResume() {
        setPaused(false);
        resume && resume();
    }
    function onClean() {
        clean && clean();
    }
}
exports.default = default_1;
//# sourceMappingURL=controls.js.map