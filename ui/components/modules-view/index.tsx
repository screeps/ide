/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, useEffect } from 'react';

const MAIN_MODULE = 'main';

export default function(props: IModulesViewProps) {
    const [value, setValue] = useState('');

    useEffect(() => setValue(''), [props.branch]);

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
                <form onSubmit={ onSubmit }>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='New module name...'

                            autoComplete=''

                            onChange={ onChange }

                            value={ value }/>
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

    function onChange(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setValue(value);
    }

    function onSubmit(event: React.FormEvent) {
        props.onCreateModule && props.onCreateModule(value);
        setValue('');

        event.preventDefault();
    }

    function _getAdditionalModules(modules: {
        [key: string]: IModule;
    }) {
        return Object.entries(modules).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
    }
}
