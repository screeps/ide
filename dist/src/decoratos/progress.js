"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let animationStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
// @ts-ignore
function progress(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        showProgress(this.viewRef);
        let result;
        try {
            result = await original.apply(this, args);
        }
        catch (err) {
            // Noop.
        }
        hideProgress(this.viewRef);
        return result;
    };
    return descriptor;
}
exports.progress = progress;
function showProgress(viewRef) {
    animationStartTime = new Date().getTime();
    if (!viewRef.current) {
        return;
    }
    viewRef.current.state.isProgressing = true;
    viewRef.current.setState(Object.assign({}, viewRef.current.state));
}
function hideProgress(viewRef) {
    const now = new Date().getTime();
    const delay = ANIMATION_MIN_TIME - (now - animationStartTime);
    setTimeout(() => {
        if (!viewRef.current) {
            return;
        }
        viewRef.current.state.isProgressing = false;
        viewRef.current.setState(Object.assign({}, viewRef.current.state));
    }, delay > 0 ? delay : 0);
}
//# sourceMappingURL=progress.js.map