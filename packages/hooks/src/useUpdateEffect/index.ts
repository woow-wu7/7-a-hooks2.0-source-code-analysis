import { useEffect, useRef } from 'react';

// useUpdateEffect
// 1
// - 模拟 componentDidUpdate，当不存在依赖项时
// 2
// useUpdateEffect(
//   effect: () => (void | (() => void | undefined)),
//   deps?: deps,
// )
const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      // 1
      // ref.current
      // ref.current 的值在组件的整个生命周期中保持不变，相当于classComponent中的一个属性，因为属性挂载到原型链上的
      // 2
      // react源码中 ref 对象通过 Object.seal() 密封了，不能添加删除，只能修改
      isMounted.current = true; // 初始化时，进入if，false => true；之后不再进入
    } else {
      return effect();
      // 1. update => 第一次不执行effect()，只有也只会在依赖更新时执行即除了第一次，以后和useEffect行为保持一致
      // 2. 如果没有依赖项 deps，则和 ( componentDidMount ) 行为保持一致

      // 注意：
      // 1. 这里的 return 是为了完全模拟 useEffect，因为 useEffect 可以还有清除函数
      // 2. effect函数签名是：effect: () => (void | (() => void | undefined)) 说明可以返回一个清除函数
      // 3. 注意点：传入effect函数中，还可以return一个函数，这个函数就是真正的 useEffect(() => () => { 清除函数中做点事情 }) 中 return 的清除函数
    }
  }, deps);
};

export default useUpdateEffect;
