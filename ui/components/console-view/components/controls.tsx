import * as React from 'react';
import { useState } from 'react';

interface IConsoleControlsViewProps {
    shard: string;
    shards: any;
    paused: boolean;

    onShard?(shard: string): void;
    onResume?(): void;
    onPause?(): void;
    onClean?(): void;
}

export default function({
    shard,
    shards,
    paused: _paused,

    onShard: applyShard,
    onResume: resume,
    onPause: pause,
    onClean: clean,
}: IConsoleControlsViewProps) {
    const [paused, setPaused] = useState(_paused);
    let toggle;

    if (paused) {
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
                    className='btn icon' onClick={ onClean }><i className='sc-icon-delete' />
                </button>
                { toggle }
            </div>
        </div>
    );

    function onShard(event: any) {
        applyShard && applyShard(event.target.value);
    }

    function onPause() {
        setPaused(true);

        pause && pause();
    }

    function onResume() {
        setPaused(false);

        resume && resume();
    }

    function onClean() {
        clean && clean();
    }
}
