/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, useEffect } from 'react';

const MAIN_MODULE = 'main';

export default function(props: IModulesViewProps) {
    const [value, setValue] = useState('');
    const [isValid, setValid] = useState(true);
    const [modules, setModules] = useState<[string, IModule][]>([]); 
    const [scrollTo, setScrollTo] = useState();

    useEffect(() => {
        setValue('');
        setValid(true);
    }, [props.branch]);

    useEffect(() => {
        const _modules = Object.entries(props.modules).sort(([a], [b]) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });

        setModules(_modules);
    }, [props.modules]);

    useEffect(() => {
        if (!scrollTo) {
            return;
        }

        const pathRef = document.querySelector(`.screeps-modules-view__item[data-module='${ scrollTo }']`);

        if (pathRef) {
            pathRef.scrollIntoView();
        }

        setScrollTo(null);
    }, [modules]);

    return (
        <div className='screeps-ide screeps-modules-view'>
            <div className='screeps-modules-view__header'>
                <span>Modules in branch</span>
                <span>{ props.branch }</span>
            </div>
            <hr className={ 'screeps-hr' } />
            <div className='screeps-modules-view__items'>
                <ul className='tab-bar'>
                    <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                        props.modules[MAIN_MODULE] && props.modules[MAIN_MODULE].modified ? ' modified' : '' ) +  (
                        props.active  === `@${ props.branch }/${ MAIN_MODULE }.js` ? ' active' : ''
                    )} data-module={ MAIN_MODULE }>
                        <button className='btn btn--clear'
                            onClick={() => onSelectModule(MAIN_MODULE)}
                            onDoubleClick={() => onSelectModule(MAIN_MODULE, false)}
                        >{ MAIN_MODULE }</button>
                        <div className='modified-icon'></div>
                    </li>
                    {modules.map(([ moduleName, { modified }]) => {
                        return (
                    <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                        modified ? ' modified' : '' ) +  (
                        props.active === `@${ props.branch }/${ moduleName }.js` ? ' active' : ''
                    )} key={moduleName} data-module={ moduleName }>
                        <button className='btn btn--clear'
                            onClick={() => onSelectModule(moduleName)}
                            onDoubleClick={() => onSelectModule(moduleName, false)}
                        >{ moduleName }</button>
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

    function onSelectModule(module: string, textEditorPending: boolean = true) {
        props.onSelectModule && props.onSelectModule(module, textEditorPending);
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

        if (!isValid || !value) {
            return;
        }

        props.onCreateModule && props.onCreateModule(value);
        setValue('');
        setScrollTo(value);
    }
}
