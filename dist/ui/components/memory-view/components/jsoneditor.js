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
        this.editorRef = new jsoneditor_1.default(this.editorContainerRef.current, {
            name: this.props.name || 'Memory'
        }, this.props.value || 'undefined');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setValue(nextProps.value);
        }
    }
    render() {
        return (React.createElement("div", { className: 'native-key-bindings', ref: this.editorContainerRef }));
    }
    getValue() {
        return this.editorRef.get();
    }
    setValue(value) {
        this.editorRef.set(value);
    }
}
exports.default = MemoryJSONEditorView;
//# sourceMappingURL=jsoneditor.js.map