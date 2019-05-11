import { BehaviorSubject } from 'rxjs';

export const INITIAL_STATE = {
    branch: '',
    branches: [],
    modules: {
        default: {
        }
    }
};

const __state = new BehaviorSubject<IState>(INITIAL_STATE);

const next = __state.next;
__state.next = function(...args) {
    // console.log(.1, 'next', ...args);
    return next.apply(this, args);
}

export default __state;
