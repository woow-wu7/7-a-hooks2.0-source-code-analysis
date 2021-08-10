import { useEffect, useRef } from 'react';

// useUpdateEffect
// - 模拟 componentDidUpdate，当不存在依赖项时
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
      // 2. 如果没有依赖项 deps，则和 ( compoenntDidMount ) 行为保持一致
    }
  }, deps);
};

export default useUpdateEffect;
