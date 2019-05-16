import { default as store, Action } from '../../../store';
// import { REMOVE_PROJECT } from '../actions';

store.reducer((state: IState, { type }: Action): IState => {
    if (type !== 'REMOVE_PROJECT') {
        return state;
    }

    return {
        ...state
    };
});
