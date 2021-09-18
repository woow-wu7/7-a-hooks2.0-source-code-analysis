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
    return initRect; // select对象不存在，返回 rect对象初始值
  }

  if (selection.rangeCount < 1) { // selection.rangeCount 返回该选区包含的 ( 连续范围的数量 )
    return initRect;
  }

  const range = selection.getRangeAt(0);
  // selection.getRangeAt(index)
  // 作用：返回一个包含当前选区内容的区域对象

  const { height, width, top, left, right, bottom } = range.getBoundingClientRect();
  // range.getBoundingClientRect()
  // element.getBoundingClientRect()
  // 作用：返回位置坐标 Rect 对象，包含元素的大小，位置等信息，基本就是 ( css盒子模型的所有信息 )

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
// Document.getSelection
// const selection = window.getSelection()
// 功能：返回一个 ( Selection ) 对象，表示 ( 用户选择的文本范围 )，或 ( 光标的当前位置 )
// 注意点：
// - 1. ( selection.toString ) 或者 ( selection + '' ) 可以把 selection 对象转成字符串，该字符串表示的是 ( 被选中的文本 )
// - 2. window.getSelection() === Document.getSelection()
// 扩展：
// - 1. 如果 getSelection 对 <textArea> <input> 不起作用的话，可以使用 HTMLInputElement.setSelectionRange()
// ！！！
// ！！！
// 例子
// var selectionObj = window.getSelection(); --------------> Selection 对象
// var range  = selectionObj.getRangeAt(0); ---------------> Range 对象
// var rect = range.getBoundingClientRect() ---------------> Rect 对象
// var selectionStr = window.getSelection().toString() ----> Selection 字符串形式
// selectionObj.rangeCount --------------------------------> 返回该选区包含的 ( 连续范围的数量 )
// 说明：
// 1. ( Selection ) 对象所对应的是用户选择的 ( ranges ) 区域，俗称 '拖蓝'
// 2. 术语
//    - anchor：锚，指一个选区的 ( 起始点 )，指 ( 鼠标按下 ) 的瞬间的那个点，用户拖动鼠标，锚点不会变
//    - focus：焦点，指选区的 ( 终点 )，指 ( 鼠标松开 ) 的瞬间那个点
//    - range：范围，指的是文档中连续的部分，范围会被作为 Range 对象返回

// ------------------------------------------------------------------------------------------------------- useTextSelection
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
  stateRef.current = state; // state更新则更新ref

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
      let text = ''; // text
      let rect = initRect; // rect -> react中具有 top left width height 等位置信息
      if (!window.getSelection) return;
      selObj = window.getSelection(); // 鼠标up后，获取最新的selection对象
      text = selObj ? selObj.toString() : ''; // 将selection对象转成text
      if (text) { // text存在说明selection对象存在
        rect = getRectFromSelection(selObj); // 将 ( selection ) 对象转成 ( rect ) 对象
        setState({ ...state, text, ...rect }); // 更新最新的 state
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

      if (!selObj) return; // ------ selObj不存在
      selObj.removeAllRanges(); // - selObj存在
      // selection.removeAllRanges() -> 会从当前selection对象中移除所有的range对象,取消所有的选择只 留下anchorNode 和focusNode属性并将其设置为null
    };

    el.addEventListener('mouseup', mouseupHandler);

    document.addEventListener('mousedown', mousedownHandler);

    return () => { // 清除事件监听
      el.removeEventListener('mouseup', mouseupHandler);
      document.removeEventListener('mousedown', mousedownHandler);
    };
  }, [typeof target === 'function' ? undefined : target]);

  return state; // state 中包含 text top left height width 等 rect 信息
}

export default useTextSelection;
