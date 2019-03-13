import * as React from 'react';

import { default as MemoryJSONEditorView } from './jsoneditor';

interface IMemoryItemViewProps {
    path: string;
    value: any;

    onClick?: Function;

    onSave?: Function;
    onReload?: Function;
    onDelete?: Function;
    onRemovePath?: Function;
    onCancel?: Function;
}

interface IMemoryItemViewState {
    isEdit: boolean;

    path: string;
    value: any;
}

export const BTN_REMOVE = 'screeps-memory__item-remove-watch-';
export const BTN_DELETE = 'screeps-memory__item-delete-watch-';
export const BTN_UPDATE = 'screeps-memory__item-update-watch-';
export const BTN_RELOAD = 'screeps-memory__item-reload-watch-';
export const BTN_CANCEL = 'screeps-memory__item-cancel-watch-';

export default class MemoryItemView extends React.Component<IMemoryItemViewProps> {
    //@ts-ignore
    props: IMemoryItemViewProps;
    state: IMemoryItemViewState;

    editorRef = React.createRef<MemoryJSONEditorView>();

    constructor(props: IMemoryItemViewProps) {
        super(props);

        this.state = {
            isEdit: false,
            path: props.path,
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps: IMemoryItemViewProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({
                ...this.state,
                value: nextProps.value
            });
        }
    }

    public render() {
        const path = this.state.path || 'Memory root';

        let value;
        let jsonEditor;
        let deleteBtn;

        if(!this.state.isEdit) {
            let short;
            try {
                short = this.state.value.toString();
            } catch (err) {
                short = 'undefined';
            }

            value = (
                <div className='screeps-memory__value'>
                    <button className='btn btn--clear' type='button' onClick={ this.onEdit }>
                        { short }
                    </button>
                </div>
            );
        }

        if (this.state.isEdit) {
            let deleteBtn;
            if (this.state.path) {
                deleteBtn = (
                    <button id={ `${ BTN_DELETE }${ this.state.path }` }
                        type='button' className='btn btn--clear' onClick={ this.onRemovePath } title='Delete from memory'>
                        <i className='sc-icon-delete' />
                    </button>
                );
            }

            jsonEditor = (
                <div className='screeps-memory__json-editor'>
                    <div className='screeps-memory__json-editor-controlls'>
                        <button id={ `${ BTN_UPDATE }${ this.state.path || 'root' }` }
                            type='button' className='btn btn--clear' onClick={ this.onSave }>
                            <i className='sc-icon-done' />
                        </button>
                        <button id={ `${ BTN_RELOAD }${ this.state.path || 'root' }` }
                            type='button' className='btn btn--clear' onClick={ this.onReload }>
                            <i className='sc-icon-cached' />
                        </button>
                        <button id={ `${ BTN_CANCEL }${ this.state.path || 'root' }` }
                            type='button' className='btn btn--clear' onClick={ this.onCancel }>
                            <i className='sc-icon-clear' />
                        </button>
                        { deleteBtn }
                    </div>
                    <MemoryJSONEditorView ref={ this.editorRef }
                        name={ this.state.path }
                        value={ this.state.value }
                    />
                </div>
            );
        }

        if (this.state.path) {
            deleteBtn = (
                <div id={ `${ BTN_REMOVE }${ this.state.path }` }
                    className='close-icon'
                    onClick={() => this.onDelete(this.state.path)}
                />
            );
        }

        return (
            <div className='screeps-memory__item'>
                <div className='screeps-memory__item-path'>
                    <label className={ this.state.path ? '' : '--italic' }>{ path }</label>
                    { deleteBtn }
                </div>
                { value }
                { jsonEditor }
            </div>
        );
    }

    onEdit = async (): Promise<void> => {
        this.props.onClick && await this.props.onClick(this.state.path);

        this.setState({
            ...this.state,
            isEdit: true
        });
    }

    onSave = () => {
        if (!this.editorRef.current) {
            return;
        }

        this.onCancel();

        this.props.onSave && this.props.onSave(this.editorRef.current.getValue());
    }

    onReload = () => {
        this.props.onReload && this.props.onReload();
    }

    onCancel = () => {
        this.setState({
            ...this.state,
            isEdit: false
        });

        this.props.onCancel && this.props.onCancel(this.state.path);
    }

    onDelete = (data: any) => {
        this.props.onDelete && this.props.onDelete(data);
    }

    onRemovePath = () => {
        this.props.onRemovePath && this.props.onRemovePath();
        this.onCancel();
    }
}
