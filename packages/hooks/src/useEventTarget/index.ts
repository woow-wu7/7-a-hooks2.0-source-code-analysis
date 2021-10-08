import { useState, useCallback, useRef } from 'react';

interface EventTarget<U> {
  target: {
    value: U;
  };
}

export interface Options<T, U> { // options可以不传，其中的属性也可以不传
  initialValue?: T;
  transformer?: (value: U) => T;
}

// useEventTarget
function useEventTarget<T, U = T>(options?: Options<T, U>) {
  const { initialValue, transformer } = options || {};
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => setValue(initialValue), []);

  const transformerRef = useRef(transformer);
  transformerRef.current = transformer;

  const onChange = useCallback((e: EventTarget<U>) => { // 注意这里手写了EventTarget，因为可能的类型比较多，比如Input，TextArea 等等
    const _value = e.target.value;
    if (typeof transformerRef.current === 'function') { // 先做类型判断，则 transformerRef.current(_value) 作为 setValue 的参数就不会报错
      return setValue(transformerRef.current(_value));
    }

    // no transformer => U and T should be the same
    // 没有转换函数，则直接设置
    return setValue((_value as unknown) as T);
  }, []);

  return [
    value,
    { // 两个返回的函数都做缓存
      onChange,
      reset,
    },
  ] as const;
}

export default useEventTarget;
