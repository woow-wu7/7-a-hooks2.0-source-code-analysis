/* eslint no-empty: 0 */

import { useCallback, useRef, useState } from 'react';
import screenfull from 'screenfull'; // 使用到了 screenfull 第三方库
import useUnmount from '../useUnmount';
import { BasicTarget, getTargetElement } from '../utils/dom';

export interface Options {
  onExitFull?: () => void;
  onFull?: () => void;
}

// screenfull
// screenfull官网 https://github.com/sindresorhus/screenfull.js
// 这里首先需要了解几个 screenfull 的 api

// isEnabled
//  - isEnabled: boolean，当前环境是否允支持全屏功能

// isFullscreen
//  - isFullscreen: boolean，当前是否在全屏

// request()
// - request(target, options?) 让元素全全屏，实现全屏操作，传入需要全屏的元素

// off()
// - 删除之前注册过的事件监听函数，这里限制在 change 和 error 两个事件

// on()
// - 绑定事件的监听函数，同样是 change 和 error

// exit()
// - 退出全屏，返回一个promse，resolve状态时抛出的是绑定的需要全屏的元素


export default (target: BasicTarget, options?: Options) => {
  const { onExitFull, onFull } = options || {};

  const onExitFullRef = useRef(onExitFull);
  onExitFullRef.current = onExitFull;

  const onFullRef = useRef(onFull);
  onFullRef.current = onFull;

  const [state, setState] = useState(false); // 是否全屏的标志位


  const onChange = useCallback(() => {
    if (screenfull.isEnabled) { // 当前环境是否允支持全屏功能
      const { isFullscreen } = screenfull; // 是否全屏
      if (isFullscreen) {
        // 全屏
        onFullRef.current && onFullRef.current();
      } else {
        // 非全屏
        screenfull.off('change', onChange);
        // 清除change事件监听函数
        // 这里注意
        // 1. 取消事件的监听函数后，本次执行的函数还是会执行，换言之，setIsFull还是会执行
        // 2. 取消事件的监听函数，只是下次在触发事件，不会在监听该事件了，换言之，就是不再执行监听函数了
        onExitFullRef.current && onExitFullRef.current();
      }
      setState(isFullscreen); // 更新是否全屏的状态
    }
  }, []);


  // setFull 全屏
  const setFull = useCallback(() => {
    const el = getTargetElement(target); // 需要全屏的元素
    if (!el) { // el不存在
      return;
    }
    if (screenfull.isEnabled) { // el存在
      try {
        screenfull.request(el as HTMLElement); // 全屏
        screenfull.on('change', onChange); // 监听 change 事件
      } catch (error) {}
    }
  }, [target, onChange]);


  // exitFull 退出全屏
  const exitFull = useCallback(() => {
    if (!state) { // 如果当前不是全屏状态，直接返回，即不需要退出全屏
      return;
    }
    if (screenfull.isEnabled) {
      screenfull.exit(); // 退出全屏
    }
  }, [state]);


  // toggleFull 切换全屏
  const toggleFull = useCallback(() => {
    if (state) {
      exitFull();
    } else {
      setFull();
    }
  }, [state, setFull, exitFull]);


  // unmount
  // 利用useEffect一个函数函数返回一个函数时，就是mount钩子
  useUnmount(() => {
    if (screenfull.isEnabled) {
      screenfull.off('change', onChange); // mount时，清除事件监听
    }
  });


  return [
    state,
    {
      setFull, // 全屏
      exitFull, // 退出全屏
      toggleFull, // 两者切换
    },
  ] as const;
};
