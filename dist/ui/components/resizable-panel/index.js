"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class ResizablePanel extends React.Component {
    constructor(props) {
        super(props);
        this.clientY = 0;
        this.elementRef = React.createRef();
        this.onResizeStart = () => {
            const up$ = rxjs_1.fromEvent(document.body, 'mouseup');
            const move$ = rxjs_1.fromEvent(document.body, 'mousemove');
            move$.pipe(operators_1.takeUntil(up$))
                // @ts-ignore
                .pipe(operators_1.tap(({ movementY }) => {
                const element = this.elementRef.current;
                const height = parseInt(element.offsetHeight, 10);
                element.style.height = `${height + movementY}px`;
            }))
                .subscribe();
        };
    }
    render() {
        return (React.createElement("div", { ref: this.elementRef, className: 'screeps-ide screeps-resizable-panel' },
            this.props.children,
            React.createElement("div", { className: 'panel-divider', onMouseDown: this.onResizeStart })));
    }
}
exports.default = ResizablePanel;
//# sourceMappingURL=index.js.map