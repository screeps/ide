import * as React from 'react';
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'

//@ts-ignore
import JSONEditor from 'jsoneditor';

interface IMemoryJSONEditorViewProps {
    name: string;
    value: any;
}

export default forwardRef(function(props: IMemoryJSONEditorViewProps, ref) {
    const [editorRef, setEditorRef] = useState();
    const editorContainerRef = useRef(null);

    useEffect(() => {
        const editorRef = new JSONEditor(editorContainerRef.current, {
            name: props.name || 'Memory'
        }, props.value || 'undefined');

        setEditorRef(editorRef);
    }, [editorContainerRef])

    useImperativeHandle(ref, () => ({
        getValue,
        setValue
    }));

    return (
        <div className='native-key-bindings' ref={ editorContainerRef }></div>
    );

    function getValue() {
        return editorRef.get();
    }

    function setValue(value: any) {
        editorRef.set(value);
    }
})
