"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
//@ts-ignore
const jsoneditor_1 = require("jsoneditor");
class MemoryJSONEditorView extends React.Component {
    constructor(props) {
        super(props);
        this.editorContainerRef = React.createRef();
    }
    componentDidMount() {
        new jsoneditor_1.default(this.editorContainerRef.current, {}, this.props.data);
    }
    render() {
        return (React.createElement("div", { ref: this.editorContainerRef }));
    }
}
exports.default = MemoryJSONEditorView;
//# sourceMappingURL=json-editor.js.map