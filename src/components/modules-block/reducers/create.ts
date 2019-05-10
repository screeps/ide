import { default as store, Action } from '../../../store';
import { CREATE_MODULE } from '../actions';

store.reducer((state: IState, { type, payload }: Action): IState => {
    if (type !== CREATE_MODULE) {
        return state;
    }

    const { module } = payload;

    const content = `/*
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

    return {
        ...state,
        modules: {
            ...state.modules,
            [module]: {
                content,
                modified: true
            }
        }
    };
});
