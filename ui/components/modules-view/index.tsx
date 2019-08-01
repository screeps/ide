/// <reference path='./index.d.ts' />

import * as React from 'react';

const MAIN_MODULE = 'main';

export default function(props: IModulesViewProps) {

    return (
        <div className='screeps-ide screeps-modules-view'>
            <div className='screeps-modules-view__header'>
                <span>Branch</span>
                <span>{ props.branch }</span>
            </div>
            <hr className={ 'screeps-hr' } />
            <div className='screeps-modules-view__items'>
                <ul className='tab-bar'>
                    <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                        props.modules[MAIN_MODULE] && props.modules[MAIN_MODULE].modified ? ' modified' : '' ) +  (
                        props.modules[MAIN_MODULE] && props.modules[MAIN_MODULE].active ? ' active' : ''
                    )}>
                        <button className='btn btn--clear' onClick={() => onSelectModule(MAIN_MODULE)}>{ MAIN_MODULE }</button>
                        <div className='modified-icon'></div>
                    </li>
                    {_getAdditionalModules(props.modules).map(([ moduleName, { modified, active }]) => {
                        return (
                    <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                        modified ? ' modified' : '' ) +  (
                        active ? ' active' : ''
                    )} key={moduleName}>
                        <button className='btn btn--clear' onClick={() => onSelectModule(moduleName)}>{ moduleName }</button>
                        <div className='close-icon' onClick={() => onDeleteModule(moduleName)}></div>
                    </li>
                        );
                    })}
                </ul>
            </div>
            <div className='screeps-modules-view__new'>
                <form>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='New module name...'

                            autoComplete=''

                            onKeyPress={ onKeyPressHandler }/>
                        <div className='underline' />
                    </fieldset>
                </form>
            </div>
        </div>
    );

    function onSelectModule(module: string) {
        props.onSelectModule && props.onSelectModule(module);
    }

    function onDeleteModule(module: string) {
        props.onDeleteModule && props.onDeleteModule(module);
    }

    function onKeyPressHandler(event: any) {
        if (event.key !== 'Enter') {
            return;
        }

        if (!event.target.value) {
            return;
        }

        props.onCreateModule && props.onCreateModule(event.target.value);

        event.target.value = '';
    }

    function _getAdditionalModules(modules: {
        [key: string]: IModule;
    }) {
        return Object.entries(modules).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
    }
}
