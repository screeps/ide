import * as React from 'react';

//@ts-ignore
import JSONEditor from 'jsoneditor';

interface IMemoryJSONEditorViewProps {
    name: string;
    data: any;
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
        }, this.props.data || 'undefined');
    }

    componentWillReceiveProps(nextProps: IMemoryJSONEditorViewProps) {
        if (nextProps.data) {
            this.setValue(nextProps.data);
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

    setValue(value: any): any {
        this.editorRef.set(value);
    }
}
