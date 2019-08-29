import { default as store, Action } from '../../../store';
import { CREATE_MODULE } from '../actions';

function generateContent(module: string) {
    return `/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('${ module }');
* mod.thing == 'a thing'; // true
*/

module.exports = {

};
`
}

store.reducer((state: IState, { type, payload: { branch, module } }: Action): IState => {
    if (type !== CREATE_MODULE) {
        return state;
    }

    const content = generateContent(module);

    return {
        ...state,
        modules: {
            ...state.modules,
            [branch]: {
                ...state.modules[branch],
                [module]: {
                    content,
                    isNew: true,
                    modified: true
                }
            }
        }
    };
});
