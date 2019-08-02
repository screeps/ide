/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, useEffect } from 'react';

const MAIN_MODULE = 'main';

export default function(props: IModulesViewProps) {
    const [value, setValue] = useState('');
    const [isValid, setValid] = useState(true);

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
                        props.active  === `@${ props.branch }/${ MAIN_MODULE }.js` ? ' active' : ''
                    )}>
                        <button className='btn btn--clear' onClick={() => onSelectModule(MAIN_MODULE)}>{ MAIN_MODULE }</button>
                        <div className='modified-icon'></div>
                    </li>
                    {_getAdditionalModules(props.modules).map(([ moduleName, { modified }]) => {
                        return (
                    <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                        modified ? ' modified' : '' ) +  (
                        props.active === `@${ props.branch }/${ moduleName }.js` ? ' active' : ''
                    )} key={moduleName}>
                        <button className='btn btn--clear' onClick={() => onSelectModule(moduleName)}>{ moduleName }</button>
                        <div className='close-icon' onClick={() => onDeleteModule(moduleName)}></div>
                    </li>
                        );
                    })}
                </ul>
            </div>
            <div className='screeps-modules-view__new'>
                <form className={ [!isValid ? '--invalid' : ''].join(' ') }
                    onSubmit={ onSubmit }>
                    <fieldset className='screeps-field'>
                        <input className='native-key-bindings' type='text' placeholder='New module name...'

                            autoComplete=''

                            onChange={ onChange }

                            value={ value }/>
                        <div className='underline' />
                    </fieldset>
                    <div className='error'>Already exist</div>
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

        const isExist = Object.entries(props.modules)
            .some(([module]) => module === value);

        setValid(!isExist && value !== MAIN_MODULE);
        setValue(value);
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!isValid) {
            return;
        }

        props.onCreateModule && props.onCreateModule(value);
        setValue('');
    }

    function _getAdditionalModules(modules: {
        [key: string]: IModule;
    }) {
        return Object.entries(modules).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
    }
}
