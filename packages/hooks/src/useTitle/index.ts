import { useEffect, useRef } from 'react';
import useUnmount from '../useUnmount';

export interface Options {
  restoreOnUnmount?: boolean;
}

const DEFAULT_OPTIONS: Options = {
  restoreOnUnmount: false, // 是否修复页面标题
};

// useTitle 用来设置页面的标题
function useTitle(title: string, options: Options = DEFAULT_OPTIONS) {

  const titleRef = useRef(document.title);
  // document.title --> 可读写，返回 ( 当前文档的标题 )，一旦被修改就 ( 返回修改后的值 )

  useEffect(() => {
    document.title = title; // 设置新的title
  }, [title]);

  useUnmount(() => {
    if (options && options.restoreOnUnmount) {
      document.title = titleRef.current; // 如果需要修复页面标题，则使用进来就缓存在ref中的title值
    }
  });
}

export default typeof document !== 'undefined' ? useTitle : () => {};
