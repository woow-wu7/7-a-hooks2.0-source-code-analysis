import { useEffect, useState } from 'react';

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();

interface ResponsiveConfig {
  [key: string]: number;
}
interface ResponsiveInfo {
  [key: string]: boolean;
}

let info: ResponsiveInfo;

let responsiveConfig: ResponsiveConfig = {
  xs: 0, // extra small 超小
  sm: 576, // small
  md: 768, // medium 中等
  lg: 992, // large
  xl: 1200, // extra large 超大
};


function handleResize() {
  const oldInfo = info;
  calculate();
  if (oldInfo === info) return; // 计算后，还相等则不要更新数据
  for (const subscriber of subscribers) {
    subscriber(); // 更新数据
  }
}


let listening = false;

// calculate
// - 主要负责 ( 更新info )
// - 每次窗口变化都会执行该函数
function calculate() {
  const width = window.innerWidth;

  const newInfo = {} as ResponsiveInfo;
  // as - 类型断言
  // 1
  // 这里：将一个空对象断言为具体属性的对象
  // 2
  // 具体的数据类型的使用场景
  // - 将 联合类型 断言为 具体的某个类型
  // - 将 一个父类 断言为 更加具体的子类
  // - 将 any 类型的值 断言为 具体的类型
  // - 将 任何一个类型 断言为 any

  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key];
    if (newInfo[key] !== info[key]) {
      // 这里必须要保证遍历的顺序，这里是从小到大的顺序，http://jartto.wang/2016/10/25/does-js-guarantee-object-property-order/
      // 这里需谨慎
      shouldUpdate = true;
    }
    // 循环的目的
    // 1. 判断 ( 各个窗口的宽度 ) 和 ( window的宽度对比 )
    // 2. 判断是否需要更新，第一次时info={}，则遍历到最后的key都是需要更新的
    // 3. 每次判断是否需要更新后，更新info，用于下次比较
    // 理清一下 shouldUpdate 的逻辑 -> 只要info和newInfo中有一个属性的值不相等，shouldUpdate就会被置为true
  if (shouldUpdate) {
    info = newInfo; // 需要更新 -> 更新info
  }
}

export function configResponsive(config: ResponsiveConfig) {
  responsiveConfig = config;
  if (info) calculate(); // 计算
}

// useResponsive 响应式
export function useResponsive() {
  const windowExists = typeof window !== 'undefined';
  if (windowExists && !listening) { // window对象存在 并且 没有监听
    info = {};
    calculate();
    window.addEventListener('resize', handleResize); // 绑定 resize 事件的监听函数
    listening = true; // 已经监听
  }
  const [state, setState] = useState<ResponsiveInfo>(info); // 已经是更新过后的info

  useEffect(() => {
    if (!windowExists) return;

    const subscriber = () => {
      setState(info);
    };
    subscribers.add(subscriber); // 添加监听函数进Set
    // 1
    // subscribers
    // subscribers -> Set数据结构，类似数组，但是成员的值唯一
    // 2
    // Set
    // - 1. Set本身就是构造函数，用来生成Set数据结构
    // - 2. 可以接受一个数组作为参数，或者是具有 iterable 接口的其他数据结构
    // - 3. 写两个很有用的应用
    //      - [...new Set(array)] -> 数组去重
    //      - [...new Set(string)].join('') -> 字符串去重
    // - 4. Set常用方法
    //      - constructor size add delete has clear
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        window.removeEventListener('resize', handleResize);
        listening = false;
      }
    };
  }, []);

  return state;
}

// useResponsive 和 configResponsive 使用
// - https://ahooks.js.org/zh-CN/hooks/dom/use-responsive

// configResponsive
// - configResponsive 为了设置初始化的 info 对象配置
