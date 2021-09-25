import { useEffect, useState } from 'react';
import usePersistFn from '../usePersistFn';
import { BasicTarget, getTargetElement } from '../utils/dom';

interface Position {
  left: number;
  top: number;
}

export type Target = BasicTarget<HTMLElement | Document>;
export type ScrollListenController = (val: Position) => boolean;


// 1
// useScroll
// 1.1 params
//      - target: ( DOM节点 ) 或 ( Ref对象 ) - 表示的是 ( 滚动容器 )
//        - HTMLElement | (() => HTMLElement) | Document | React.MutableRefObject
//      - shouldUpdate: 是否更新滚动信息，fn返回一个boolean值
//        - ({ top: number, left: number}) => boolean
// 1.2 result
//      - position: ( 滚动容器 ) 当前的 ( 位置信息 )


// 2
// document.scrollingElement
// 作用：返回 ( 滚动文档 ) 的 ( Element ) 对象的引用，标准模式下是 ( 文档的根元素document.documentElement === html )
// 特点：
//  - document.scrollingElement一统江湖
//  - 在桌面端document.scrollingElement就是document.documentElement
//  - 在移动端document.scrollingElement就是document.body

// 3 测试
// - 链接：https://codesandbox.io/s/usescroll-m9ym4?file=/src/App.tsx

function useScroll(target?: Target, shouldUpdate: ScrollListenController = () => true): Position {

  const [position, setPosition] = useState<Position>({
    left: NaN, // number类型，初始值设置为NaN
    top: NaN,
  });

  const shouldUpdatePersist = usePersistFn(shouldUpdate);
  // usePersistFn -> 用于持久化function
  // 因为：usePersistFn(shouldUpdate) 是这样一个函数： (...args) => shouldUpdate.apply(this, args)
  // 所以：shouldUpdatePersist = (...args) => shouldUpdate.apply(this, args)

  useEffect(() => {
    const el = getTargetElement(target, document); // target不存在，则document，存在分情况处理
    if (!el) return;

    function updatePosition(currentTarget: Target): void {
      let newPosition;

      if (currentTarget === document) {
        // ------------------------------------------------------------------------------------------ target === document

        if (!document.scrollingElement) return;
        // 不存在滚动元素，则直接返回
        // document.scrollingElement -> 桌面端是docuemnt.documentElement===html，移动端是document.body

        newPosition = {
          left: document.scrollingElement.scrollLeft, // 滚动的距离，这里是滚动的垂直距离x
          top: document.scrollingElement.scrollTop, // 滚动的距离，这里是滚动的垂直距离y
        };
      } else {
        // ------------------------------------------------------------------------------------------- target !== document

        newPosition = {
          left: (currentTarget as HTMLElement).scrollLeft,
          top: (currentTarget as HTMLElement).scrollTop,
        };
      }

      if (shouldUpdatePersist(newPosition)) setPosition(newPosition); // 返回true，则设置最新的位置信息
      // 1
      // shouldUpdatePersist(newPosition)
      // 1.1 const shouldUpdatePersist = usePersistFn(shouldUpdate);
      // 1.2 shouldUpdate是一个函数
      //      - 不传时默认是 () => true
      //      - 传入时需要是这样的函数 ({ top: number, left: number}) => boolean
    }

    updatePosition(el as Target); // 这里调用，是为了在 ( 未滚动 ) 时也能获取到位置信息

    function listener(event: Event): void {
      if (!event.target) return;
      updatePosition(event.target as Target);
    }

    el.addEventListener('scroll', listener); // 监听滚动事件，滚动时更新位置信息
    return () => {
      el.removeEventListener('scroll', listener);
    };
  }, [target, shouldUpdatePersist]);

  return position;
}

export default useScroll;
