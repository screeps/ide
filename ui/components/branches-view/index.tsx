/// <reference path='./index.d.ts' />

import * as React from 'react';

export default function(props: IBranchesViewProps) {

    return (
        <div className='screeps-ide screeps-branches-view'>
            <div className='screeps-branches-view__header'>
                <span>Branches</span>
            </div>
            <hr className={ 'screeps-hr' + (props.isProgressing ? ' screeps-hr--inprogress' : '') } />
            <div className='screeps-branches-view__items'>
                <ul className='tab-bar'>
                {props.branches && props.branches.map(({ _id, branch, activeSim, activeWorld }) => {
                    let deleteButton;
                    let sim;
                    let world;

                    if (!activeSim && !activeWorld) {
                        deleteButton = <div className='close-icon' onClick={() => onDeleteBranch(branch)}></div>;
                    }

                    if (activeWorld) {
                        world = (<button className='screeps-branches-view__world --active'>
                            world
                        </button>);
                    } else {
                        world = (<button className='screeps-branches-view__world'
                            onClick={() => onSetActiveWorld(branch)}>
                            world
                        </button>);
                    }

                    if (activeSim) {
                        sim = (<button className='screeps-branches-view__sim --active'>
                            sim
                        </button>);
                    } else {
                        sim = (<button className='screeps-branches-view__sim'
                            onClick={() => onSetActiveSim(branch)}>
                            sim
                        </button>);
                    }

                    return (
                        <li className={ 'tab screeps-branches-view__item' + (
                            props.active === branch ? ' --active' : ''
                        )} key={_id}>
                            <button className='btn btn--clear' onClick={() => onCopyBranch(branch)}><i className='sc-icon-copy' /></button>
                            <button className='btn btn--clear' onClick={() => onSelectBranch(branch)}>{ branch }</button>
                            { world } { sim }
                            { deleteButton }
                        </li>
                    )
                })}
                </ul>
            </div>
        </div>
    );

    function onCopyBranch(branch: string) {
        props.onCopyBranch && props.onCopyBranch(branch);
    }

    function onSelectBranch(branch: string) {
        props.onSelectBranch && props.onSelectBranch(branch);
    }

    function onDeleteBranch(branch: string) {
        props.onDeleteBranch && props.onDeleteBranch(branch);
    }

    function onSetActiveSim(branch: string) {
        props.onSetActiveSim && props.onSetActiveSim(branch);
    }

    function onSetActiveWorld(branch: string) {
        props.onSetActiveWorld && props.onSetActiveWorld(branch);
    }
}
