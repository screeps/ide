import { default as store } from '../store';

import {
    $
} from '../utils';

export async function changeProjectBranch(event: CustomEvent) {
    let target: HTMLElement = event.target as HTMLElement;

    const el = $('span:first-child', target);

    if (!el) {
        return;
    }

    const projectPath = el.getAttribute('data-path');

    store.dispatch({
        type: 'CREATE_PROJECT',
        payload: {
            projectPath,
            projectPathLabel: 'Project folder path',
            projectPathReadonly: true,
            download: true,
            downloadForce: true,
            submitBtn: 'Change'
        }
    });
}