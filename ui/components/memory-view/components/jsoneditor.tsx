import * as React from 'react';

//@ts-ignore
import JSONEditor from 'jsoneditor';

interface IMemoryJSONEditorViewProps {
    name: string;
    value: any;
}

export default class MemoryJSONEditorView extends React.Component<IMemoryJSONEditorViewProps> {
    //@ts-ignore
    props: IMemoryJSONEditorViewProps;

    editorRef: JSONEditor;
    editorContainerRef: React.RefObject<any>;

    constructor(props: IMemoryJSONEditorViewProps) {
        super(props);

        this.editorContainerRef = React.createRef();
    }

    componentDidMount() {
        this.editorRef = new JSONEditor(this.editorContainerRef.current, {
            name: this.props.name || 'Memory'
        }, this.props.value || 'undefined');
    }

    componentWillReceiveProps(nextProps: IMemoryJSONEditorViewProps) {
        if (nextProps.value) {
            this.setValue(nextProps.value);
        }
    }

    public render() {
        return (
            <div className='native-key-bindings' ref={ this.editorContainerRef }></div>
        );
    }

    getValue(): any {
        return this.editorRef.get();
    }

    setValue(value: any): void {
        this.editorRef.set(value);
    }
}
