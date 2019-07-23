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

export default function(props: IMemoryMainViewProps) {
    return (
        <div className='screeps-memory__main'>
            <div className='screeps-memory__main-items'>
                { props.memory.map(({ path, value }) => {
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

    async function onClick(path: string): Promise<void> {
        props.onClick && await props.onClick(path);
    }

    function onReload(path: string) {
        props.onReload && props.onReload(path);
    }

    function onSave(path: string, value: any) {
        props.onSave && props.onSave(path, value);
    }

    function onDelete(path: string) {
        props.onDelete && props.onDelete(path);
    }

    function onRemovePath(path: string) {
        props.onRemovePath && props.onRemovePath(path);
    }

    function onInput(path: string) {
        props.onInput && props.onInput(path);
    }

    function onCancel(path: string) {
        props.onCancel && props.onCancel(path);
    }
}
