"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let animationStartTime = 0;
const ANIMATION_MIN_TIME = 1500;
// @ts-ignore
function progress(target, name, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        showProgress(this);
        let result;
        try {
            result = await original.apply(this, args);
        }
        catch (err) {
            hideProgress(this);
            throw err;
        }
        hideProgress(this);
        return result;
    };
    return descriptor;
}
exports.progress = progress;
function showProgress(component) {
    animationStartTime = new Date().getTime();
    component.state = { isProgressing: true };
}
function hideProgress(component) {
    const now = new Date().getTime();
    const delay = ANIMATION_MIN_TIME - (now - animationStartTime);
    setTimeout(() => {
        component.state = { isProgressing: false };
    }, delay > 0 ? delay : 0);
}
//# sourceMappingURL=progress.js.map