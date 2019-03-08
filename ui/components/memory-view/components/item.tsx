import * as React from 'react';

import { default as MemoryJSONEditorView } from './json-editor';

interface IMemoryItemViewProps {
    path: string;
    data: any;
    value: any;

    onClick?: Function;

    onSave?: Function;
    onReload?: Function;
    onDelete?: Function;
}

interface IMemoryItemViewState {
    isEdit: boolean;

    path: string;
    data: any;
    value: any;
}

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
            data: props.data,
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps: IMemoryItemViewProps) {
        if (nextProps.data !== this.state.data) {
            this.setState({
                ...this.state,
                data: nextProps.data
            });
        }

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
            value = (
                <div className='screeps-memory__value'>
                    <button className='btn btn--clear' type='button' onClick={ this.onEdit }>
                        { this.state.value }
                    </button>
                </div>
            );
        }

        if (this.state.isEdit) {
            let deleteBtn;
            if (this.state.path) {
                deleteBtn = (
                    <button type='button' className='btn btn--clear' onClick={ this.onDelete }>
                        <i className='sc-icon-delete' />
                    </button>
                );
            }

            jsonEditor = (
                <div className='screeps-memory__json-editor'>
                    <div className='screeps-memory__json-editor-controlls'>
                        <button type='button' className='btn btn--clear' onClick={ this.onSave }>
                            <i className='sc-icon-done' />
                        </button>
                        <button type='button' className='btn btn--clear' onClick={ this.onReload }>
                            <i className='sc-icon-cached' />
                        </button>
                        <button type='button' className='btn btn--clear' onClick={ this.onCancel }>
                            <i className='sc-icon-clear' />
                        </button>
                        { deleteBtn }
                    </div>
                    <MemoryJSONEditorView ref={ this.editorRef }
                        name={ this.state.path }
                        data={ this.state.data }
                    />
                </div>
            );
        }

        if (this.state.path) {
            deleteBtn = (
                <div className='close-icon' onClick={() => this.onDelete(this.state.path)}></div>
            );
        }

        return (
            <div className='screeps-memory__item'>
                <div className='screeps-memory__expression'>
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
    }

    onDelete = (data: any) => {
        this.props.onDelete && this.props.onDelete(data);
    }
}
