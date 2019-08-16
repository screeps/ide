import * as React from 'react';
import { useState, useRef } from 'react';

import { default as MemoryJSONEditorView } from './jsoneditor';

interface IMemoryItemViewProps {
    id: string;
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
                <button className='btn btn--clear' type='button'

                    onClick={ onEdit }
                    onKeyPress={ onEnter(onEdit) }

                    tabIndex={ 7 }
                >
                    { short }
                </button>
            </div>
        );
    } else {
        let size;
        let deleteBtn;
        if (props.path) {
            deleteBtn = (
                <button id={ `${ BTN_DELETE }${ props.id }` }
                    tabIndex={ 7 }
                    type='button' className='btn btn--clear' onClick={ onRemovePath } title='Delete from memory'>
                    <i className='sc-icon-delete' />
                </button>
            );
        }

        size = (
            <span>{ (JSON.stringify(props.value).length / 1024).toFixed(1) } KB</span>
        );

        jsonEditor = (
            <div className='screeps-memory__json-editor'>
                <div className='screeps-memory__json-editor-controlls'>
                    <button id={ `${ BTN_UPDATE }${ props.id }` }
                        tabIndex={ 7 }
                        type='button' className='btn btn--clear' onClick={ onSave }>
                        <i className='sc-icon-done' />
                    </button>
                    <button id={ `${ BTN_RELOAD }${ props.id }` }
                        tabIndex={ 7 }
                        type='button' className='btn btn--clear' onClick={ onReload }>
                        <i className='sc-icon-cached' />
                    </button>
                    <button id={ `${ BTN_CANCEL }${ props.id }` }
                        tabIndex={ 7 }
                        type='button' className='btn btn--clear' onClick={ onCancel }>
                        <i className='sc-icon-clear' />
                    </button>
                    { deleteBtn }
                    { size }
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
            <div id={ `${ BTN_REMOVE }${ props.id }` }
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
        props.onClick && await props.onClick(props.path);

        setIsEdit(!isEdit);
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

    async function onReload() {
        const value = props.onReload && await props.onReload();

        // @ts-ignore
        editorRef.current.setValue(value);
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

    function onEnter(handler: Function) {
        return function({ key }: React.KeyboardEvent) {
            key === 'Enter' && handler();
        }
    }
}
