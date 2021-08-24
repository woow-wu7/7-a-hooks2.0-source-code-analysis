import { useEffect } from 'react';
import usePersistFn from '../usePersistFn';

<<<<<<< HEAD
// useTimeout
function useTimeout(fn: () => void, delay: number | null | undefined): void {
  const timerFn = usePersistFn(fn); // 持久化函数，相当于class中的属性

  useEffect(() => {
    if (delay === undefined || delay === null) return; // 兼容性
=======
function useTimeout(fn: () => void, delay: number | null | undefined): void {
  const timerFn = usePersistFn(fn);

  useEffect(() => {
    if (delay === undefined || delay === null) return;
>>>>>>> 3dc5e0de57222972a0992179e086f87c5592a0d1
    const timer = setTimeout(() => {
      timerFn();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, timerFn]);
}

export default useTimeout;
