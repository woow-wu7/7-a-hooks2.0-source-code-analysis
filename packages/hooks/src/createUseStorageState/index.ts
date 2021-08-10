import { useState, useCallback } from 'react';
import useUpdateEffect from '../useUpdateEffect';

export interface IFuncUpdater<T> {
  (previousState?: T): T;
}
export interface IFuncStorage {
  (): Storage;
}

export type StorageStateResult<T> = [T | undefined, (value?: T | IFuncUpdater<T>) => void];
export type StorageStateResultHasDefaultValue<T> = [T, (value: T | IFuncUpdater<T>) => void];

function isFunction<T>(obj: any): obj is T {
  return typeof obj === 'function';
}

//createUseStorageState
export function createUseStorageState(nullishStorage: Storage | null) {
  function useStorageState<T = undefined>(key: string): StorageStateResult<T>; // 只有一个参数的情况
  function useStorageState<T>( // 两个参数的情况
    key: string,
    defaultValue: T | IFuncUpdater<T>,
  ): StorageStateResultHasDefaultValue<T>;

  function useStorageState<T>(key: string, defaultValue?: T | IFuncUpdater<T>) {
    const storage = nullishStorage as Storage;
    const [state, setState] = useState<T | undefined>(() => getStoredValue());

    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);
    // useUpdateEffect - 首次加载不运行，之后只在依赖更新时运行

    // const useUpdateEffect: typeof useEffect = (effect, deps) => {
    //   const isMounted = useRef(false);
    //   useEffect(() => {
    //     if (!isMounted.current) {
    //       isMounted.current = true;
    //     } else {
    //       return effect();
    //     }
    //   }, deps);
    // };

    // getStoredValue
    // 1. raw存在，转成对象返回
    // 2. row不存在
    //    - 1. defaultValue 是一个函数，调用并返回执行结果
    //    - 2. defaultValue 不是一个函数，直接返回
    function getStoredValue() {
      const raw = storage.getItem(key); // raw：未加工

      if (raw) {
        try {
          return JSON.parse(raw); // storage中存在key对应的数据，parse 并返回
        } catch (e) {}
      }

      if (isFunction<IFuncUpdater<T>>(defaultValue)) {
        // 1
        // if
        // - 如果 defalut 是一个函数，调用函数，返回调用结果值
        // 2
        // defaultValue
        // - useLocalStorageState() 的第二个参数，表示初始化默认值
        return defaultValue();
      }

      return defaultValue;
    }

    const updateState = useCallback(
      (value?: T | IFuncUpdater<T>) => {
        if (typeof value === 'undefined') {
          // 1. undefined
          // - storage 清除 // updateState() 或者 updateState(unfined)
          // - state undefined
          storage.removeItem(key);
          setState(undefined);
        } else if (isFunction<IFuncUpdater<T>>(value)) {
          // value = (prevState: T) => T
          // 2. function
          // - storage 存入新值 - 新值是 value(previousState) 函数调用的返回值
          // - state
          const previousState = getStoredValue();
          const currentState = value(previousState);
          storage.setItem(key, JSON.stringify(currentState));
          setState(currentState);
        } else {
          // 3. 非 undefined 和 function
          // - storage 存入新值
          // - state value
          storage.setItem(key, JSON.stringify(value));
          setState(value);
        }
      },
      [key],
    );

    return [state, updateState];
  }

  if (!nullishStorage) {
    // localStorage不存在时熔断处理
    return function (_: string, defaultValue: any) {
      return [
        isFunction<IFuncUpdater<any>>(defaultValue) ? defaultValue() : defaultValue,
        () => {},
      ];
    } as typeof useStorageState;
  }

  return useStorageState;
}
