import { useEffect } from 'react';
import usePersistFn from '../usePersistFn';
import { isFunction } from '../utils';

// useUnmount
const useUnmount = (fn: any) => {
  const fnPersist = usePersistFn(fn);

  useEffect( // useEffect返回的函数就是清除函数， useEffect(() => () => 需要清除的内容)
    () => () => {
      if (isFunction(fnPersist)) {
        fnPersist();
      }
    },
    [],
  );
};

export default useUnmount;
