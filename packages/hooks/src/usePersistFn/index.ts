import { useRef } from 'react';

export type noop = (...args: any[]) => any; // 空函数

// usePersistFn
// 说明：usePersistFn调用后返回一个函数，该函数是经过包装的fn函数，具体是 (...args) => fn(...args)
// 作用：持久化function的hook
// 注意：持久化也可以通过useCallback来实现，但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render，对于超级复杂的子组件，重新渲染会对性能造成影响。通过 usePersistFn，可以保证函数地址永远不会变化
function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();

  if (!persistFn.current) { // 不存在则赋值
    persistFn.current = function (...args) { // 将 参数fn持久化，并再包装一层函数后返回
      return fnRef.current!.apply(this, args); // 返回一个函数，该函数就是缓存在ref上的 ( 参数fn函数 )

      // 问题：这里有个奇怪的符号 fnRef.current!.apply() ， !是啥？
      // 回答：x!表示的是 ( 非空断言 ) 即 ( 将从x的值域中去除null和undefined )
      // 具体：上面的语法表示：fnRef.current是非unll和undefined时就调用apply方法
    } as T;
  }

  return persistFn.current!;
}

export default usePersistFn;
