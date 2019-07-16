import * as React from 'react';
import { useState } from 'react';

interface IConsoleControlsViewProps {
    shard: string;
    shards: any;
    paused: boolean;

    onShard?(shard: string): void;
    onResume?(): void;
    onPause?(): void;
    onDelete?(): void;
}

export default function({
    shard,
    shards,
    paused: _paused,

    onShard: applyShard,
    onResume: resume,
    onPause: pause,
    onDelete: clear,
}: IConsoleControlsViewProps) {
    const [paused, setPausedValue] = useState(_paused)
    let toggle;

    if (!paused) {
        toggle = (<button id='screeps-console__play'
            className='btn icon' onClick={ onResume }><i className='sc-icon-play' />
        </button>);
    } else {
        toggle = (<button id='screeps-console__pause'
            className='btn icon' onClick={ onPause }><i className='sc-icon-pause' />
        </button>);
    }

    return (
        <div className='screeps-console__controls'>
            <div className=''>
                <select className='input-select' onChange={ onShard } value={ shard }>
                    { shards.map(({ name }: { name: string }) => {
                        return (<option key={ name } value={ name }>{ name }</option>);
                    })}
                </select>
            </div>
            <div className='btn-group'>
                <button id='screeps-console__delete'
                    className='btn icon' onClick={ onDelete }><i className='sc-icon-delete' />
                </button>
                { toggle }
            </div>
        </div>
    );

    function onShard(event: any) {
        applyShard && applyShard(event.target.value);
    }

    function onPause() {
        setPausedValue(false);

        pause && pause();
    }

    function onResume() {
        setPausedValue(true);

        resume && resume();
    }

    function onDelete() {
        clear && clear();
    }
}
