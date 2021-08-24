import { useEffect } from 'react';
import usePersistFn from '../usePersistFn';

// useTimeout
function useTimeout(fn: () => void, delay: number | null | undefined): void {
  const timerFn = usePersistFn(fn); // 持久化函数，相当于class中的属性

  useEffect(() => {
    if (delay === undefined || delay === null) return; // 兼容性
    const timer = setTimeout(() => {
      timerFn();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, timerFn]);
}

export default useTimeout;
