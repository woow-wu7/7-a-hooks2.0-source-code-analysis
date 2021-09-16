import { useCallback, useState } from 'react';

// useUpdate
// 强制更新
const useUpdate = () => {
  const [, setState] = useState({}); // 这里第一个返回值赋值是空，即忽略

  return useCallback(() => setState({}), []);
  // setState每次都传入一个新的对象，则会更新
  // 返回个一个函数，直接调用即可，其实这里返回的是内联回调函数 () => setState({}) 函数的 memoized 版本
};

export default useUpdate;
