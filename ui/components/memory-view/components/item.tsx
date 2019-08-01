import * as React from 'react';
import { useState, useRef } from 'react';

import { default as MemoryJSONEditorView } from './jsoneditor';

interface IMemoryItemViewProps {
    path: string;
    value: any;
    isEdit: boolean;

    onClick?: Function;
    onSave?: Function;
    onReload?: Function;
    onDelete?: Function;
    onRemovePath?: Function;
    onCancel?: Function;
}

export const BTN_REMOVE = 'screeps-memory__item-remove-watch-';
export const BTN_DELETE = 'screeps-memory__item-delete-watch-';
export const BTN_UPDATE = 'screeps-memory__item-update-watch-';
export const BTN_RELOAD = 'screeps-memory__item-reload-watch-';
export const BTN_CANCEL = 'screeps-memory__item-cancel-watch-';

export default function(props: IMemoryItemViewProps) {
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const editorRef = useRef();

    let value;
    let jsonEditor;
    let deleteBtn;

    if(!isEdit) {
        let short;
        try {
            short = props.value.toString();
        } catch (err) {
            short = 'undefined';
        }

        value = (
            <div className='screeps-memory__value'>
                <button className='btn btn--clear' type='button' onClick={ onEdit }>
                    { short }
                </button>
            </div>
        );
    } else {
        let deleteBtn;
        if (props.path) {
            deleteBtn = (
                <button id={ `${ BTN_DELETE }${ props.path }` }
                    type='button' className='btn btn--clear' onClick={ onRemovePath } title='Delete from memory'>
                    <i className='sc-icon-delete' />
                </button>
            );
        }

        jsonEditor = (
            <div className='screeps-memory__json-editor'>
                <div className='screeps-memory__json-editor-controlls'>
                    <button id={ `${ BTN_UPDATE }${ props.path || 'root' }` }
                        type='button' className='btn btn--clear' onClick={ onSave }>
                        <i className='sc-icon-done' />
                    </button>
                    <button id={ `${ BTN_RELOAD }${ props.path || 'root' }` }
                        type='button' className='btn btn--clear' onClick={ onReload }>
                        <i className='sc-icon-cached' />
                    </button>
                    <button id={ `${ BTN_CANCEL }${ props.path || 'root' }` }
                        type='button' className='btn btn--clear' onClick={ onCancel }>
                        <i className='sc-icon-clear' />
                    </button>
                    { deleteBtn }
                </div>
                <MemoryJSONEditorView ref={ editorRef }
                    name={ props.path }
                    value={ props.value }
                />
            </div>
        );
    }

    if (props.path) {
        deleteBtn = (
            <div id={ `${ BTN_REMOVE }${ props.path }` }
                className='close-icon'
                onClick={() => onDelete(props.path)}
            />
        );
    }

    return (
        <div className='screeps-memory__item' data-path={ props.path }>
            <div className='screeps-memory__item-path'>
                <label className={ props.path ? '' : '--italic' }>
                    { props.path || 'Memory root' }
                </label>
                { deleteBtn }
            </div>
            { value }
            { jsonEditor }
        </div>
    );

    async function onEdit(): Promise<void> {
        setIsEdit(!isEdit);

        props.onClick && await props.onClick(props.path);
    }

    async function onSave() {
        try {
            // @ts-ignore
            props.onSave && await props.onSave(editorRef.current.getValue());

            onCancel();
        } catch(err) {
            // Noop.
        }
    }

    function onReload() {
        props.onReload && props.onReload();
    }

    function onCancel() {
        setIsEdit(false);

        props.onCancel && props.onCancel(props.path);
    }

    function onDelete(data: any) {
        props.onDelete && props.onDelete(data);
    }

    function onRemovePath() {
        onCancel();

        props.onRemovePath && props.onRemovePath();
    }
}
