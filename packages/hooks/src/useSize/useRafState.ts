import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useRef, useState } from 'react';
import useUnmount from '../useUnmount';

const useRafState = <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
  const frame = useRef(0); // 唯一ID
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(frame.current); // 取消动画

    frame.current = requestAnimationFrame(() => {
      setState(value); // 更新值
    });
  }, []);

  useUnmount(() => {
    // 卸载时清除副作用
    cancelAnimationFrame(frame.current);
  });

  return [state, setRafState];
};

export default useRafState;
