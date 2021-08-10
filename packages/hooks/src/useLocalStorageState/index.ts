import { createUseStorageState } from '../createUseStorageState';

// 1 useLocalStorageState
// 一个可以将状态持久化存储在 localStorage 中的 Hook 。
const useLocalStorageState = createUseStorageState(
  typeof window === 'object' ? window.localStorage : null,
  // window存在，传入 window.localStorage
  // 否则传入 null
);

export default useLocalStorageState;
