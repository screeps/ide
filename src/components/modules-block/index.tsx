import * as React from 'react';

import { 
    CreateModuleAction,
    DeleteModuleAction,
    OpenTextEditorAction
} from './actions';

import { default as confirm } from '../confirm-modal';
import { default as store } from '../../store';
import { selectModules } from '../../state';

import './reducers';
import * as effects from './effects';

Object.values(effects).forEach((effect) => effect.subscribe());

import ModulesView from '../../../ui/components/modules-view';
import { updateUserCode } from '../../actions';

type ModulesBlockProps  = {
    branch: string;
    modules: IModules;
    active: string;
}

export function ModulesBlock(props: ModulesBlockProps) {

    return (
        <ModulesView
            branch={ props.branch }
            modules={ props.modules }

            active={ props.active }

            onCreateModule={(...args) => onCreateModule(...args)}
            onSelectModule={(...args) => onSelectModule(...args)}
            onDeleteModule={(...args) => onDeleteModule(...args)}
        />
    )

    async function onCreateModule(module: string): Promise<void> {
        store.dispatch(CreateModuleAction(props.branch, module));
        store.dispatch(OpenTextEditorAction(props.branch, module));
    }

    async function onSelectModule(module: string, textEditorPending: boolean): Promise<void> {
        store.dispatch(OpenTextEditorAction(props.branch, module, textEditorPending));
    }

    async function onDeleteModule(module: string): Promise<void> {
        try {
            await confirm({
                submitBtn: 'Delete',
                legend: 'This action cannot be undone! Are you sure?'
            });

        } catch(err) {
            return;
        }

        const modules = selectModules(props.branch);
        delete modules[module];

        await updateUserCode(props.branch, modules);

        store.dispatch(DeleteModuleAction(props.branch, module));
    }
}
