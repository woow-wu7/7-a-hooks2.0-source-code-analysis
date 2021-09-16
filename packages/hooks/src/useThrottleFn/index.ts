import throttle from 'lodash.throttle';
import { useRef } from 'react';
import useCreation from '../useCreation';
import { ThrottleOptions } from '../useThrottle/throttleOptions';
import useUnmount from '../useUnmount';

type Fn = (...args: any) => any;

// export interface ThrottleOptions {
//   wait?: number;
//   leading?: boolean;
//   trailing?: boolean;
// }

// useThrottleFn
function useThrottleFn<T extends Fn>(fn: T, options?: ThrottleOptions) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;
  // 问题：这里为什么要在赋一次fn给fnRef.current呢 ？
  // 回答：为了解决闭包问题
  // issue：https://github.com/alibaba/hooks/issues/1121

  const wait = options?.wait ?? 1000;

  const throttled = useCreation(
    () =>
      throttle<T>(
        ((...args: any[]) => {
          return fnRef.current(...args);
        }) as T,
        wait,
        options,
      ),
    [],
  );

  useUnmount(() => {
    throttled.cancel();
  });

  return {
    run: (throttled as unknown) as T,
    cancel: throttled.cancel,
    flush: throttled.flush,
  };
}

export default useThrottleFn;
