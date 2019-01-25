"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MemoryMainView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__main' }, this.props.watches.map(() => {
            return (React.createElement("div", null));
        })));
    }
}
exports.default = MemoryMainView;
//# sourceMappingURL=main.js.map