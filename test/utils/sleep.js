
export function sleep(ms = 1000) {
    const sleepy = {};
    sleepy.timer = setTimeout(() => {
        sleepy.timer = null;
        sleepy.resolve();
    }, ms);
    sleepy.promise = new Promise((resolve,reject) => {
        sleepy.resolve = resolve;
        sleepy.reject = reject;
    });
    sleepy.cancel = () => {
        if (!sleepy.timer) return;
        clearTimeout(sleepy.timer);
        sleepy.timer = null;
        sleepy.resolve();
    };
    sleepy.unref = () => {
        if (!sleepy.timer) return;
        sleepy.timer.unref()
    };
    sleepy.promise.cancel = sleepy.cancel;
    sleepy.promise.unref = sleepy.unref;
    return sleepy.promise;
}

export async function timeout(ms = 1000, ...promises) {
    const sleepy = sleep(ms);
    sleepy.unref();
    try {
        return await Promise.race([
            ...promises,
            sleepy.then(throwTimeout)
        ]);
    } finally {
        sleepy.cancel();
    }
}

function throwTimeout() {
    const error = new Error('timeout');
    error.code = 'ETIMEOUT';
    throw error;
}
