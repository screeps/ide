let animationStartTime: number = 0;
const ANIMATION_MIN_TIME = 1500;

// @ts-ignore
export function progress(target: any, name: any, descriptor: any) {
    const original = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        showProgress(this.viewRef);

        let result;
        try {
            result = await original.apply(this, args);
        } catch (err) {
            // Noop.
        }

        hideProgress(this.viewRef);
        return result;
    };

    return descriptor;
}


function showProgress(viewRef: any) {
    animationStartTime = new Date() .getTime();

    if (!viewRef.current) {
        return;
    }

    viewRef.current.state.isProgressing = true;
    viewRef.current.setState({
        ...viewRef.current.state
    });
}

function hideProgress(viewRef: any) {
    const now = new Date() .getTime();
    const delay = ANIMATION_MIN_TIME - (now - animationStartTime);

    setTimeout(() => {
        if (!viewRef.current) {
            return;
        }

        viewRef.current.state.isProgressing = false;
        viewRef.current.setState({
            ...viewRef.current.state
        });
    }, delay > 0 ? delay : 0);
}
