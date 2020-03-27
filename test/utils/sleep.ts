class Cancelable<T> extends Promise<T> {
  cancel() { }
  unref() { }
}

export function sleep(ms: number = 1000) {
  const sleepy: { timer?: any, resolve?: () => void, promise?: Cancelable<void>, cancel?: () => void, unref?: () => void } = {};
  //@ts-ignore
  sleepy.timer = setTimeout(() => {
    sleepy.timer = null;
    sleepy.resolve && sleepy.resolve();
  }, ms);
  sleepy.promise = new Promise((resolve) => {
    sleepy.resolve = resolve;
  }) as Cancelable<void>;
  sleepy.cancel = () => {
    if (!sleepy.timer) return;
    clearTimeout(sleepy.timer);
    sleepy.timer = null;
    sleepy.resolve && sleepy.resolve();
  };
  sleepy.unref = () => {
    if (!sleepy.timer) return;
    sleepy.timer.unref();
  };
  sleepy.promise.cancel = sleepy.cancel;
  sleepy.promise.unref = sleepy.unref;
  return sleepy.promise;
}

export async function timeout(ms: number = 1000, ...promises: Promise<any>[]) {
  const sleepy = sleep(ms);
  sleepy.unref();
  try {
    return await Promise.race([...promises, sleepy.then(throwTimeout)]);
  } finally {
    sleepy.cancel();
  }
}

function throwTimeout() {
  const error = new Error('timeout');
  //@ts-ignore
  error.code = 'ETIMEOUT';
  throw error;
}
