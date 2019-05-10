import * as React from 'react';

import { 
    CreateModuleAction,
    DeleteModuleAction,
    OpenTextEditorAction
} from './actions';

import { default as store } from '../../store';

import './reducers';
import * as effects from './effects';

Object.values(effects).forEach((effect) => effect.subscribe());

import ModulesView from '../../../ui/components/modules-view';

export function ModulesBlock({ branch, modules }: { branch: any, modules: IModules }) {

    return (
        <ModulesView
            branch={ branch }
            modules={ modules }

            onCreateModule={(...args) => onCreateModule(...args)}
            onSelectModule={(...args) => onSelectModule(...args)}
            onDeleteModule={(...args) => onDeleteModule(...args)}
        />
    )

    async function onCreateModule(module: string): Promise<void> {
        store.dispatch(CreateModuleAction(module));
        store.dispatch(OpenTextEditorAction(module));
    }

    async function onSelectModule(module: string): Promise<void> {
        store.dispatch(OpenTextEditorAction(module));
    }

    async function onDeleteModule(module: string): Promise<void> {
        store.dispatch(DeleteModuleAction(module));
    }
}