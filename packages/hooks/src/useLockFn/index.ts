import { useRef, useCallback } from 'react';

// 1
// useLockFn
// - 作用：用于给一个异步函数增加竞态锁，防止并发执行
// - 注意点：在使用的时候，最好将fn在包装一层fn2，因为这样里层真正的fn就可以穿参了，如下面的例子
// - 使用例子
/**
 *  const submit = useLockFn(async () => {
      await request();
      setCount((val) => val + 1);
    });
    // 注意点：这里useLockFn直接执行了，返回的是 (...args) => fn(...args)，而fn是useLockFn的参数函数
 */

// 2
// useCallback
// - 函数签名：useCallback(() => fn, [])
// - 参数
//    - 第一个参数：() => fn 是内联回调函数
//    - 第二个参数：[] 是依赖数组
// - 返回值
//    - 返回该 ( 内联回调函数 ) 的 memoized 版本
//    - 该 ( 回调函数 ) 仅在 ( 某个依赖项 ) 改变时才会更新
// - 注意点
//    - useCallback(fn, deps) === useMemo(() => fn, deps)

// 3
// 泛型函数的两种写法
// 1. function a<T>(params: T) {...}
// 2. const a = <T>(params: T) => {....}

// 4
// 泛型约束
// p extends any[] ---> 将p的any类型约束成 any[] ---> 这样就可以用p来指代any[]

function useLockFn<P extends any[] = any[], V extends any = any>(fn: (...args: P) => Promise<V>) {
  const lockRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (lockRef.current) return; // 标识为位为 true 则 return
      lockRef.current = true; // 会立即执行，标识位 true
      try {
        const ret = await fn(...args);
        lockRef.current = false; // 执行完fn后，标识位置为 fasle --> 则会从新进入再次有机会执行fn
        return ret;
      } catch (e) {
        lockRef.current = false;
        throw e;
      }
    },
    [fn],
  );
}

export default useLockFn;
