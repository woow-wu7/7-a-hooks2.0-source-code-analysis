import { useRef } from 'react';

export type noop = (...args: any[]) => any;

// usePersistFn
function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      return fnRef.current!.apply(this, args); // 返回一个函数，该函数就是缓存在ref上的 ( 参数fn函数 )
    } as T;
  }

  return persistFn.current!;
}

export default usePersistFn;
