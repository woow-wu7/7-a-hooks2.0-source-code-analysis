import { useRef } from 'react';

export type noop = (...args: any[]) => any;

<<<<<<< HEAD
// usePersistFn
=======
>>>>>>> 3dc5e0de57222972a0992179e086f87c5592a0d1
function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
<<<<<<< HEAD
      return fnRef.current!.apply(this, args); // 返回一个函数，该函数就是缓存在ref上的 ( 参数fn函数 )
=======
      return fnRef.current!.apply(this, args);
>>>>>>> 3dc5e0de57222972a0992179e086f87c5592a0d1
    } as T;
  }

  return persistFn.current!;
}

export default usePersistFn;
