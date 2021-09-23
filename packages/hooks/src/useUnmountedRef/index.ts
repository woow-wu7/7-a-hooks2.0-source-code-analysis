import { useRef, useEffect } from 'react';

// useUnmountedRef
// - 获取当前组件 ( 是否已经被卸载 ) 的hook
const useUnmountedRef = () => {
  const unmountedRef = useRef(false);
  useEffect(() => {
    unmountedRef.current = false; // 未被卸载

    return () => {
      unmountedRef.current = true; // 已被卸载
    };
  }, []);

  // useEffect
  // 问题：第一个参数函数的 ( 回调函数 ) 执行的 ( 时机 ) ？
  // 回答：
  // 1. 当useEffect的第二个参数：依赖项是[]时，将在组件卸载时执行
  // 2. 当useEffect的第二个参数：不存在第二个参数时，将在 ( 下一次副作用执行时，执行上一次的副作用清除工作 )
  return unmountedRef; // 返回ref，通过ref.current获取组件是否被卸载
};

export default useUnmountedRef;
