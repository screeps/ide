import { BehaviorSubject } from 'rxjs';

const __state = new BehaviorSubject<IState>({
    branch: '',
    modules: {}
});

const next = __state.next;
__state.next = function(...args) {
    // console.log(.1, 'next', ...args);
    return next.apply(this, args);
}

export default __state;
