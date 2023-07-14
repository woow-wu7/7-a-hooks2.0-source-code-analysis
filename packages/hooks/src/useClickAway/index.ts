import { useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from '../utils/dom';


// getTargetElement
// export function getTargetElement(
//   target?: BasicTarget<TargetElement>,
//   defaultElement?: TargetElement,
// ): TargetElement | undefined | null {
//   if (!target) {
//     return defaultElement; // target不存在，返回第二个参数 defaultElement，类型是 TargetElement
//   }
//   let targetElement: TargetElement | undefined | null; // HTMLElement | Element | Document | Window | undefined | null
//   if (typeof target === 'function') {
//     targetElement = target(); // target是 ( function )，调用后赋值给targetElement
//   } else if ('current' in target) {
//     targetElement = target.current; // target是 ( ref )
//   } else {
//     targetElement = target; // BasicTarget类型范围内，除去 function object<Ref> 以外的类型则直接赋值
//   }
//   return targetElement;
// }

// BasicTarget
// export type BasicTarget<T = HTMLElement> =
//   | (() => T | null)
//   | T
//   | null
//   | MutableRefObject<T | null | undefined>;
// 可变ref对象，mutable是可变的意思

// 鼠标点击事件，click 不会监听右键
const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

// useClickAway
// - away：是离开的意思
export default function useClickAway(
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = defaultEvent, // 不传，默认 click 事件
) {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const handler = (event: any) => {
      // 1
      // targets 将 target包装成数组
      const targets = Array.isArray(target) ? target : [target];

      // 2
      // target不包装数组 -> 其实这里可以不把target包装成数组，如下
      // const handler = (e: Event) => {
      //   const targetElement = target?.current;
      //   if (targetElement && !targetElement?.contains(e.target)) { // target存在，并且点击的元素不是target的子元素，则执行回调
      //     onClickAwayRef.current(e);
      //   }
      // };

      if (
        targets.some((targetItem) => {
          const targetElement = getTargetElement(targetItem) as HTMLElement;
          return !targetElement || targetElement?.contains(event.target);

          // 1
          // Node.contains(target)
          // 概念：返回 boolean，表示 ( 传入的target节点 ) 是否是 ( Node节点 ) 的 ( 后代节点 )
          // 注意：两种说话都是OK的，1.node节点是否包含target节点 2. target是否是node的后代节点

          // 2
          // 注意：这里的target一般要在input外包装一层，这样点击才会有子元素
        })
      ) {
        return;
        // target不存在，或者点击的元素是target的子元素，直接返回
        // 点击的元素是target的子元素，说明点击的区域是在target内，而不是在target外
      }

      onClickAwayRef.current(event); // 执行 onClickAway
    };

    document.addEventListener(eventName, handler); // 事件监听

    return () => {
      document.removeEventListener(eventName, handler); // 移除事件监听
    };
  }, [target, eventName]);
}
