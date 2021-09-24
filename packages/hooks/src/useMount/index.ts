import { useEffect } from 'react';

// useMount
// - 只在mount阶段执行一次
const useMount = (fn: () => void) => {
  useEffect(() => {
    fn();
  }, []);
};

export default useMount;
