"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
//@ts-ignore
const jsoneditor_1 = require("jsoneditor");
exports.default = react_1.forwardRef(function (props, ref) {
    const [editorRef, setEditorRef] = react_1.useState();
    const editorContainerRef = react_1.useRef(null);
    react_1.useEffect(() => {
        const editorRef = new jsoneditor_1.default(editorContainerRef.current, {
            name: props.name || 'Memory'
        }, props.value || 'undefined');
        setEditorRef(editorRef);
    }, [editorContainerRef]);
    react_1.useImperativeHandle(ref, () => ({
        getValue,
        setValue
    }));
    return (React.createElement("div", { className: 'native-key-bindings', ref: editorContainerRef }));
    function getValue() {
        return editorRef.get();
    }
    function setValue(value) {
        editorRef.set(value);
    }
});
//# sourceMappingURL=jsoneditor.js.map