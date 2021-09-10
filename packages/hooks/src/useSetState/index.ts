import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

// useSetState
// 1
// - 管理 object 类型的 state 的 hooks，用法与class组件的 this.setState 基本保持一致
// - 特点：
//    - 1. 管理 object 类型的state
//    - 2. 用法和 this.setState() 保持一致

// 2
// type Required<T> = {
//   [P in keyof T]-?: T[P];
// };
// Required<T> -> 表示T的部分属性

const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, setState] = useState<T>(initialState);

  const setMergeState = useCallback((patch) => { // path是一个对象，或者一个函数
    setState((prevState) => ({ ...prevState, ...(isFunction(patch) ? patch(prevState) : patch) })); // 是函数执行函数，否则直接合并对象作为新的state
  }, []);

  return [state, setMergeState];
};

export default useSetState;
