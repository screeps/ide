/// <reference path='./index.d.ts' />

import * as React from 'react';

const MAIN_MODULE = 'main';

class ModulesView extends React.Component<IModulesViewProps> {
    //@ts-ignore
    props: IModulesViewProps;

    constructor(props: IModulesViewProps) {
        super(props);

        // console.log('ModulesView::constructor', props.modules);
    }

    public render() {
        // console.log('ModulesView::render', '');

        return (
            <div className='screeps-ide screeps-modules-view'>
                <div className='screeps-modules-view__header'>
                    <span>Branch</span>
                    <button className='btn btn--clear'>
                        { this.props.branch }
                    </button>

                    {/* <button className='btn btn--clear' onClick={() => this.onApplyChanges()} disabled={ !this.hasChanges() }>
                        <i className='sc-icon-done' />
                    </button> */}
                    {/* <button className='btn btn--clear' onClick={() => this.onRevertChanges()} disabled={ !this.hasChanges() }>
                        <i className='sc-icon-revert' />
                    </button> */}
                </div>
                <hr className={ 'screeps-hr' } />
                <div className='screeps-modules-view__items'>
                    <ul className='tab-bar'>
                        <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                            this.props.modules[MAIN_MODULE] && this.props.modules[MAIN_MODULE].modified ? ' modified' : '' ) +  (
                            this.props.modules[MAIN_MODULE] && this.props.modules[MAIN_MODULE].active ? ' active' : ''
                        )}>
                            <button className='btn btn--clear' onClick={() => this.onSelectModule(MAIN_MODULE)}>{ MAIN_MODULE }</button>
                            <div className='modified-icon'></div>
                        </li>
                        {this._getAdditionalModules(this.props.modules).map(([ moduleName, { modified, active }]) => {
                            return (
                        <li className={ 'tab screeps-modules-view__item screeps-modules-view__module' + (
                            modified ? ' modified' : '' ) +  (
                            active ? ' active' : ''
                        )} key={moduleName}>
                            <button className='btn btn--clear' onClick={() => this.onSelectModule(moduleName)}>{ moduleName }</button>
                            <div className='close-icon' onClick={() => this.onDeleteModule(moduleName)}></div>
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

                                onKeyPress={ this.onKeyPressHandler }/>
                            <div className='underline' />
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }

    hasChanges() {
        return Object.values(this.props.modules)
            .some(({ modified, deleted }) => !!modified || !!deleted);
    }

    onCreateModule(module: string) {
        this.props.onCreateModule && this.props.onCreateModule(module);
    }

    onSelectModule(module: string) {
        this.props.onSelectModule && this.props.onSelectModule(module);
    }

    onDeleteModule(module: string) {
        this.props.onDeleteModule && this.props.onDeleteModule(module);
    }

    onApplyChanges() {
        this.props.onApplyChanges && this.props.onApplyChanges();
    }

    onRevertChanges() {
        this.props.onRevertChanges && this.props.onRevertChanges();
    }

    onKeyPressHandler = (event: any) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (!event.target.value) {
            return;
        }

        this.props.onCreateModule && this.props.onCreateModule(event.target.value);

        event.target.value = '';
    }

    private _getAdditionalModules = (modules: {
        [key: string]: IModule;
    }) => {
        return Object.entries(modules).filter(([name, { deleted }]) => {
            return name !== MAIN_MODULE && !deleted;
        });
    }
}

export default ModulesView;
