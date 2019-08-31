"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function default_1(props) {
    const [height, setHeight] = react_1.useState(props.height);
    const [style, setStyle] = react_1.useState({});
    const elementRef = react_1.useRef(null);
    react_1.useEffect(() => {
        if (height) {
            setStyle(Object.assign({}, style, { 'height': `${height}px` }));
        }
    }, [height]);
    return (React.createElement("div", { ref: elementRef, className: 'screeps-ide screeps-resizable-panel', style: style },
        props.children,
        React.createElement("div", { className: 'panel-divider', onMouseDown: onResizeStart })));
    function onResizeStart() {
        const up$ = rxjs_1.fromEvent(document.body, 'mouseup');
        const move$ = rxjs_1.fromEvent(document.body, 'mousemove');
        move$.pipe(operators_1.takeUntil(up$))
            // @ts-ignore
            .pipe(operators_1.tap(({ movementY }) => {
            const element = elementRef.current;
            if (!element) {
                return;
            }
            const height = element.offsetHeight + movementY;
            setHeight(height);
            props.onChangeHeight && props.onChangeHeight(height);
        }))
            .subscribe();
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map