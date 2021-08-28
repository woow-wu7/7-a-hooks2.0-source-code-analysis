import { MutableRefObject } from 'react';

export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>; // 可变ref对象，mutable是可变的意思

//  interface MutableRefObject<T> {
//     current: T;
//   }

type TargetElement = HTMLElement | Element | Document | Window;

// getTargetElement
export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {

  if (!target) {
    return defaultElement; // undefined
  }

  let targetElement: TargetElement | undefined | null; // HTMLElement | Element | Document | Window | undefined | null

  if (typeof target === 'function') {
    targetElement = target(); // function
  } else if ('current' in target) {
    targetElement = target.current; // ref
  } else {
    targetElement = target; // BasicTarget类型范围内，除去 undefined function object<Ref> 以外的类型
  }

  return targetElement;
}
