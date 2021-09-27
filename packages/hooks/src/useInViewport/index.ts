import { useEffect, useState } from 'react';
import 'intersection-observer';
import { getTargetElement, BasicTarget } from '../utils/dom';

type InViewport = boolean | undefined;

function isInViewPort(el: HTMLElement): InViewport {
  if (!el) {
    return undefined;
  }

  const viewPortWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // viewPortWidth
  //  - 逐渐降级，window -> html -> body
  //  - window.innerWidth 返回网页在当前窗口中 ( 可见部分的宽度 )，即 ( 视口的宽度 )，只读

  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  const rect = el.getBoundingClientRect();
  // Element.getBoundingclientRect 返回一个对象，提供当前元素节点的大小，位置等信息，基本上是 ( css盒子模型的所有信息 )，注意所有属性都是把 border 属性算作元素的一部分

  if (rect) {
    const { top, bottom, left, right } = rect; // 位置信息
    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
    // bottom > 0 底部除了适口顶部
    // top <= viewPortHeight 顶部出了视口底部
    // left<= viewPortWidth  左边除了视口右边
    // right > 0 右边出视口左边
    // 以上未超出就返回true
  }

  return false;
}

// -------------------------------------------------------------------------------------------------------- useInViewport
// 1
// useInViewport
// 功能：判断一个DOM元素是否在 ( 可视范围 ) 内的hook
// 参数
//  - target：DOM element  or Ref Object ( DOM元素或者ref对象 )
// 返回值
//  - boolean -> btarget是否在可是范围

// 2
// 2.1
// scroll
// - 原理：scroll事件通过getBoundingClientRect获取坐标，在判断是否在视口内
// - 缺点：scroll事件很容器造成性能问题
// 2.2
// IntersectionObserver
// - 原理：( 目标元素 ) 与 ( 视口 ) 产生一个 ( 交叉区域 ) -> 交叉观察器
// const io = new IntersectionObserver(callback, options)
// 参数
//  - callback 可见性变化的回调函数
//      - 当目标元素发生可变性变化时，会调用该callback
        //  callback回调的参数 entries
        //  - entries 是一个 ( 数组 )，每个成员是一个 ( IntersectionObserverEntry ) 对象
        //  - 如果同时有两个被观察的对象的可见性发生变化，entries数组就会有两个成员
        // IntersectionObserverEntry
        //  - 该对象一共 ( 6 ) 个属性
        //  - IntersectionObserverEntry.time ------------> 可变性变化的时间
        //  - IntersectionObserverEntry.target ----------------> 被观察的目标元素
        //  - IntersectionObserverEntry.rootBounds ------------> ( 根 ) 元素的 ( 矩形区域信息 )；getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
        //  - IntersectionObserverEntry.boundingClientRect ----> ( 目标元素 ) 的 ( 矩形区域信息 )
        //  - IntersectionObserverEntry.intersectionRect ------> ( 目标元素 ) 和 ( 视口 或 根元素 ) 的 ( 交叉区域 ) 的信息
        //  - IntersectionObserverEntry.intersectionRatio -----> ( 目标元素 ) 的 ( 可见比例 )，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0
        //  - options 配置对象
        //      - threshold：决定了什么时候触发回调；是一个数组，每个成员都是一个门槛值，默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数
        //      - root：( 目标元素节点 ) 所在的 ( 容器节点 )，即 ( 根节点 )，注意：容器元素必须是目标元素的 ( 祖先节点 )
        //      - rootMargin：定义 ( 根元素 ) 的 ( margin )
// 返回值
//  - 返回值 ( io ) 是一个 ( 观察器实例 )
//  - io.observe(DOM节点-Element) ---> 开始观察，如果要观察多个节点，可以多次调用
//  - io.unobserve(Element) --------> 停止观察
//  - io.disconnect() --------------> 关闭观察器
// 注意点
//  - IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发
//  - IntersectionObserver的实现，应该采用requestIdleCallback()，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行
// 案例
//  - 惰性加载
//  - 无限滚动
// 例子
//  - './intersectionObservable.htlm'

function useInViewport(target: BasicTarget): InViewport {
  const [inViewPort, setInViewport] = useState<InViewport>(() => {
    const el = getTargetElement(target);
    return isInViewPort(el as HTMLElement); // 初始时target是否在可视区域
  });
  // type InViewport = boolean | undefined

  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return () => {};
    }

    // IntersectionObserver
    const observer = new IntersectionObserver((entries) => { // entries是一个数组
      for (const entry of entries) {
        if (entry.isIntersecting) { // target 和 root 是否有交集
          // 是否在视口
          setInViewport(true);
        } else {
          setInViewport(false);
        }
      }
    });

    observer.observe(el as HTMLElement); // 开始观察

    return () => {
      observer.disconnect(); // 是否链接，停止观察
    };
  }, [target]);

  return inViewPort;
}

export default useInViewport;
