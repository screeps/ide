const fs = require('fs');

import { default as store, Action } from '../../../store';
import { default as __state } from '../../../state';
import {
    DELETE_MODULE
} from '../actions';

import {
    getModulePath,
} from '../../../utils';

export const deleteEffect = store
.effect(({ branch }: IState, { type, payload: { module } }: Action): void => {
    if (type !== DELETE_MODULE) {
        return;
    }

    const modulePath = getModulePath(branch, module);

    try {
        fs.unlink(modulePath, () => {})
    } catch (err) {
        // Noop.
    }
});
