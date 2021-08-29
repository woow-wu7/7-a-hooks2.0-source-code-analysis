import { useCallback, useState } from 'react';

// useUpdate
// 强制更新
const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
  // setState每次都传入一个新的对象，则会更新
  // 返回个一个函数，直接调用即可
};

export default useUpdate;
