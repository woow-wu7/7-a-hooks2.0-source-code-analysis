import { useRef } from 'react';

// useCreation
// 说明：
// - useCreation 是 useMemo 或者 useRef 的替代品，因为useMemo不能保证memo的值一定不会被重计算
// 使用：
// - const b = useCreation(() => new Subject(), [])
export default function useCreation<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    // 初始值是false，并且 ( 两个依赖数组不相等，或两个依赖数组每个成员不相等 -> 即依赖项变化，才会重新计算 )
    current.deps = deps;
    current.obj = factory(); // 通过工厂函数生成实例对象
    current.initialized = true; // 标志位，保证在initialized维度，只执行一次
  }
  // if不成立，往下走
  return current.obj as T;
}

// depsAreSame
// - 用来比较两个依赖数组的属性是否完全一样，需要注意的是两个数组的成员是引用类型时需要是同一个引用才成立 -> 浅比较
// - 举例
//    - depsAreSame([[]], [[]]) // fasle
//    - depsAreSame([1], [1]) // true
function depsAreSame(oldDeps: any[], deps: any[]): boolean {
  // 1. 两个对象是同一个引用 -> 返回true
  if (oldDeps === deps) return true;

  // 2. 两个对象不是同一个引用，两个对象任意一个属性不相等 -> 返回false
  for (let i = 0; i < oldDeps.length; i++) {
    if (oldDeps[i] !== deps[i]) return false;
  }

  // 3. 两个对象不是同一个引用，但是两个对象的每一个属性都相等 -> 返回true
  return true;
}
