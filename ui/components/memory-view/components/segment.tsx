import * as React from 'react';

interface IMemorySegmentViewProps {
    segment: string;

    onChange?: Function;
}

export default function(props: IMemorySegmentViewProps) {
    return (
        <div className='screeps-memory__segment'>
            <textarea className='native-key-bindings' 

            placeholder='NO DATA'
            value={ props.segment } 

            onChange={ onChange }
            
            tabIndex={ 7 }/>
        </div>
    );

    function onChange(event: any) {
        props.onChange && props.onChange(event.target.value);
    }
}
