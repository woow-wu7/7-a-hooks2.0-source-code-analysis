import { useEffect, useRef, useState } from 'react';
import { BasicTarget, getTargetElement } from '../utils/dom';

interface IRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}
export interface IState extends IRect {
  text: string;
}

const initRect: IRect = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
};

const initState: IState = {
  text: '',
  ...initRect,
};


// getRectFromSelection --> 将 ( selection ) 对象转成 ( Rect ) 对象
function getRectFromSelection(selection: Selection | null): IRect {
  if (!selection) {
    return initRect;
  }

  if (selection.rangeCount < 1) {
    return initRect;
  }

  const range = selection.getRangeAt(0);
  // selection.getRangeAt(index)
  // 作用：返回一个包含当前选区内容的区域对象

  const { height, width, top, left, right, bottom } = range.getBoundingClientRect();
  // range.getBoundingClientRect()
  // 作用：返回位置坐标 Rect

  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
  };
}

/**
 * 获取用户选取的文本或当前光标插入的位置
 * */

// 1
// BasicTarget
//  export type BasicTarget<T = HTMLElement> =
//  | (() => T | null)
//  | T
//  | null
//  | MutableRefObject<T | null | undefined>; // 可变ref对象，mutable是可变的意思

// 2
// window.getSelection
// const selection = window.getSelection()
// 功能：返回一个 ( Selection ) 对象，表示 ( 用户选择的文本范围 )，或 ( 光标的当前位置 )
// 注意点：
// - 1. ( selection.toString ) 或者 ( selection + '' ) 可以把 selection 对象转成字符串，该字符串表示的是 ( 被选中的文本 )
// - 2. window.getSelection() === Document.getSelection()
// 扩展：
// - 1. 如果 getSelection 对 <textArea> <input> 不起作用的话，可以使用 HTMLInputElement.setSelectionRange()


function useTextSelection(target?: BasicTarget): IState {

  const [state, setState] = useState(initState);

  // const initState: IState = {
  //   text: '',
  //   ...initRect,
  // };

  // const initRect: IRect = { // 坐标相关
  //   top: NaN,
  //   left: NaN,
  //   bottom: NaN,
  //   right: NaN,
  //   height: NaN,
  //   width: NaN,
  // };

  const stateRef = useRef(state);
  // 缓存初始state
  // 注意：
  // (1) 即使state变化了，stateRef依然是是初始state的值，而不会随state变化而变化
  // (2) 但是下面的 stateRef.current = state 却改变了上面本来不会变的state，导致 stateRef.current 更新成了最新的state
  stateRef.current = state;

  useEffect(() => {
    // 获取 target 需要放在 useEffect 里，否则存在组件未加载好的情况而导致元素获取不到

    const el = getTargetElement(target, document);
    // 1. target存在，就返回targe(又分了几种类型)，不存在返回document
    // 2. target的类型是：(() => T | null) | null | MutableRefObject | T

    if (!el) {
      return () => {}; // el不存在，返回空函数
    }

    // mouseup
    const mouseupHandler = () => {
      let selObj: Selection | null = null;
      let text = '';
      let rect = initRect;
      if (!window.getSelection) return;
      selObj = window.getSelection(); // 鼠标up后，获取最新的selection对象
      text = selObj ? selObj.toString() : ''; // 将selection对象转成text
      if (text) {
        rect = getRectFromSelection(selObj); // 将 ( selection ) 对象转成 ( rect ) 对象
        setState({ ...state, text, ...rect });
      }
    };

    // mousedown
    // 任意点击都需要清空之前的 range
    const mousedownHandler = () => {
      if (!window.getSelection) return; // window.getSelecton方法不存在，返回
      if (stateRef.current.text) { // 如果最新的state.text存在
        setState({ ...initState }); // 重置
      }
      const selObj = window.getSelection();
      if (!selObj) return;
      selObj.removeAllRanges();
      // selection.removeAllRanges() -> 会从当前selection对象中移除所有的range对象,取消所有的选择只 留下anchorNode 和focusNode属性并将其设置为null
    };

    el.addEventListener('mouseup', mouseupHandler);

    document.addEventListener('mousedown', mousedownHandler);

    return () => { // 清除事件
      el.removeEventListener('mouseup', mouseupHandler);
      document.removeEventListener('mousedown', mousedownHandler);
    };
  }, [typeof target === 'function' ? undefined : target]);

  return state;
}

export default useTextSelection;
