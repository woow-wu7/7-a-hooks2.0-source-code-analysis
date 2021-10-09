import { useState, useMemo } from 'react';

type IState = string | number | boolean | undefined;

export interface Actions<T = IState> {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: T) => void;
}

function useToggle<T = boolean | undefined>(): [boolean, Actions<T>];

function useToggle<T = IState>(defaultValue: T): [T, Actions<T>];

function useToggle<T = IState, U = IState>(
  defaultValue: T,
  reverseValue: U,
): [T | U, Actions<T | U>];


// useToggle
function useToggle<D extends IState = IState, R extends IState = IState>( // useToggle 带参数时，表示在两个参数值之间切换
  defaultValue: D = false as D,
  reverseValue?: R,
) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {

    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;
    // 1. 第二个参数不存在，则反向值是把第一个参数取反
    // 2. 否则使用第二个参数
    // 注意：
    //  1. 以下的 toggle setLeft setRight 都要遵循这个规则
    //  2. 即第二个参数是否存在，来获取反的值

    // 切换返回值
    const toggle = (value?: D | R) => {
      // 强制返回状态值，适用于点击操作

      // 1
      // toggle()有参数
      // - 直接设置成 toggle 的参数值
      if (value !== undefined) {
        setState(value);
        return;
      }

      // 2
      // toggle()没参数
      // - 先判断当前的state
      //    - 如果是第一个参数值，则取反，注意取反时，需要判断useToggle有几个参数，即reverseValueOrigin的判断逻辑
      //    - 如果不是第一个参数值，取反，就直接设置为第一个值
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    };

    // 设置默认值
    const setLeft = () => setState(defaultValue);

    // 设置取反值
    const setRight = () => setState(reverseValueOrigin);

    return { // useMemo的函数的返回值，缓存一个对象，这里返回三个改变state的方法
      toggle,
      setLeft,
      setRight,
    };
  }, [defaultValue, reverseValue]);

  return [state, actions]; // 最终返回 state 和 actions
}

export default useToggle;
