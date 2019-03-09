"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ResizablePanel extends React.Component {
    constructor(props) {
        super(props);
        this.clientY = 0;
        this.elementRef = React.createRef();
        this.onResizeStart = (event) => {
            this.clientY = event.clientY;
            document.addEventListener('mousemove', this.onResize);
            document.addEventListener('mouseup', this.onResizeStop);
        };
        this.onResize = (event) => {
            if (!this.elementRef.current) {
                return;
            }
            const parent = this.elementRef.current.parentElement;
            const offsetY = event.clientY - this.clientY;
            this.clientY = event.clientY;
            const height = parseInt(parent.style.height, 10);
            parent.style.height = `${height - offsetY}px`;
        };
        this.onResizeStop = () => {
            document.removeEventListener('mousemove', this.onResize);
            document.removeEventListener('mouseup', this.onResizeStop);
        };
    }
    render() {
        return (React.createElement("div", { ref: this.elementRef, className: 'screeps-ide screeps-resizable-panel' },
            React.createElement("div", { className: 'panel-divider', onMouseDown: this.onResizeStart }),
            this.props.children));
    }
}
exports.default = ResizablePanel;
//# sourceMappingURL=index.js.map