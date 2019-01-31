import * as React from 'react';

//@ts-ignore
import JSONEditor from 'jsoneditor';

interface IMemoryJSONEditorViewProps {
    data: any;
}

export default class MemoryJSONEditorView extends React.Component<IMemoryJSONEditorViewProps> {
    //@ts-ignore
    props: IMemoryJSONEditorViewProps;

    editorContainerRef: any;

    constructor(props: IMemoryJSONEditorViewProps) {
        super(props);

        this.editorContainerRef = React.createRef();
    }

    componentDidMount() {
        new JSONEditor(this.editorContainerRef.current, {}, this.props.data);
    }

    public render() {
        return (
            <div ref={ this.editorContainerRef }></div>
        );
    }
}
