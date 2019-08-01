import * as React from 'react';

import { default as MemoryItemView } from './item';
import { default as MemoryInputView } from './input';

interface IMemoryMainViewProps {
    memory: IMemoryPath[];

    onClick?: Function;
    onDelete?: Function;
    onInput?: Function;
    onSave?: Function;
    onReload?: Function;
    onRemovePath?: Function;
    onCancel?: Function;
}

function sort(a: IMemoryPath, b: IMemoryPath) {
    if(a.path < b.path) {
        return -1;
    }

    if(a.path > b.path) {
        return 1;
    }

    return 0;
}

export default function(props: IMemoryMainViewProps) {
    return (
        <div className='screeps-memory__main'>
            <div className='screeps-memory__main-items'>
                { props.memory.sort(sort).map(({ path, value }) => {
                    return (<MemoryItemView key={ path }
                        path={ path }
                        value={ value }
                        isEdit={ false }

                        onClick={ () => onClick(path) }
                        onReload={ () => onReload(path) }
                        onDelete={ () => onDelete(path) }
                        onSave={ (value: any) => onSave(path, value) }
                        onRemovePath={ () => onRemovePath(path) }
                        onCancel={() => onCancel(path)}
                    />)
                })}
            </div>
            <hr className='screeps-hr' />
            <MemoryInputView onInput={ onInput } />
        </div>
    );

    function onClick(path: string) {
        return props.onClick && props.onClick(path);
    }

    function onReload(path: string) {
        return props.onReload && props.onReload(path);
    }

    function onSave(path: string, value: any) {
        return props.onSave && props.onSave(path, value);
    }

    function onDelete(path: string) {
        return props.onDelete && props.onDelete(path);
    }

    function onRemovePath(path: string) {
        return props.onRemovePath && props.onRemovePath(path);
    }

    function onInput(path: string) {
        return props.onInput && props.onInput(path);
    }

    function onCancel(path: string) {
        return props.onCancel && props.onCancel(path);
    }
}
