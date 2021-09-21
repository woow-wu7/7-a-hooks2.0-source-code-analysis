import { useEffect, useRef } from 'react';

// useInterval -> 一个处理 setInterval 的 hook
function useInterval(
  fn: () => void,
  delay: number | null | undefined,
  options?: {
    immediate?: boolean;
  },
): void {
  const immediate = options?.immediate;

  const fnRef = useRef<() => void>();
  fnRef.current = fn;

  useEffect(() => {
    if (delay === undefined || delay === null) return; // delay是undefined或null直接返回，根据参数类型得知：delay还剩下number类型

    // 1 立即执行
    if (immediate) {
      fnRef.current?.();
    }

    // 2 非立即执行
    const timer = setInterval(() => {
      fnRef.current?.();
    }, delay);
    return () => {
      clearInterval(timer); // 清除定时器，这里一定要清除上一次的定时器，不然事件之间会相互影响，比如执行改变delay的事件时
    };
  }, [delay]);
}

export default useInterval;
