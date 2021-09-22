import { useEffect } from 'react';
import usePersistFn from '../usePersistFn';
import { isFunction } from '../utils';

// useUnmount
const useUnmount = (fn: any) => {
  const fnPersist = usePersistFn(fn); // persist 保持，维持

  useEffect( // useEffect返回的函数就是清除函数， useEffect(() => () => 需要清除的内容)
    () => () => { // 注意这里的结构，在useEffect的参数函数中返回了一个函数，这个函数就是清除函数
      if (isFunction(fnPersist)) {
        fnPersist();
      }
    },
    [],
  );
};

export default useUnmount;
