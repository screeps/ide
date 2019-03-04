import * as React from 'react';

import { default as MemoryJSONEditorView } from './json-editor';

interface IMemoryItemViewProps {
    item: any;

    onClick?: Function;
    onDelete?: Function;
}

interface IMemoryItemViewState {
    isEdit: boolean;
}

export default class MemoryItemView extends React.Component<IMemoryItemViewProps> {
    //@ts-ignore
    props: IMemoryItemViewProps;

    state: IMemoryItemViewState;

    constructor(props: IMemoryItemViewProps) {
        super(props);

        this.state = { isEdit: false };
    }

    public render() {
        const path = this.props.item.path || 'Memory root';

        let value;
        let jsonEditor;
        let deleteBtn;

        if(!this.state.isEdit || !this.props.item.data) {
            value = (
                <div className='screeps-memory__value'>
                    <button className='btn btn--clear' type='button' onClick={ this.onEdit }>
                        { this.props.item.value }
                    </button>
                </div>
            );
        }

        if (this.state.isEdit && this.props.item.data) {
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
                        <button type='button' className='btn btn--clear' onClick={ this.onDelete }>
                            <i className='sc-icon-delete' />
                        </button>
                    </div>
                    <MemoryJSONEditorView data={ this.props.item.data }/>
                </div>
            );
        }

        if (this.props.item.path) {
            deleteBtn = (
                <div className='close-icon' onClick={() => this.onDelete(this.props.item.path)}></div>
            );
        }

        return (
            <div className='screeps-memory__item'>
                <div className='screeps-memory__expression'>
                    <label className={ this.props.item.path ? '' : '--italic' }>{ path }</label>
                    { deleteBtn }
                </div>
                { value }
                { jsonEditor }
            </div>
        );
    }

    onEdit = () => {
        console.log(this.props.item);

        this.setState({
            ...this.state,
            isEdit: true
        });

        this.props.onClick && this.props.onClick(this.props.item);
    }

    onSave = () => {
        console.log('onSave');
    }
    onReload = () => {
        console.log('onReload');
    }
    onCancel = () => {
        this.setState({
            ...this.state,
            isEdit: false
        })
        console.log('onCancel');
    }
    onDelete = (data: any) => {
        this.props.onDelete && this.props.onDelete(data);
    }
}
