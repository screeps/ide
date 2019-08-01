let animationStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

// @ts-ignore
export function progress(target: any, name: any, descriptor: any) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        showProgress(this);

        let result;
        try {
            result = await original.apply(this, args);
        } catch (err) {
            hideProgress(this);
            throw err;
        }

        hideProgress(this);
        return result;
    };

    return descriptor;
}


function showProgress(component: any) {
    animationStartTime = new Date() .getTime();

    component.state = { isProgressing: true };
}

function hideProgress(component: any) {
    const now = new Date() .getTime();
    const delay = ANIMATION_MIN_TIME - (now - animationStartTime);

    setTimeout(() => {
        component.state = { isProgressing: false };
    }, delay > 0 ? delay : 0);
}
