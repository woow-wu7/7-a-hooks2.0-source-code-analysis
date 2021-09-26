import { useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from '../utils/dom';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
export type KeyFilter = keyType | Array<keyType> | ((event: KeyboardEvent) => boolean);
export type EventHandler = (event: KeyboardEvent) => void;
export type keyEvent = 'keydown' | 'keyup';

export type Target = BasicTarget<HTMLElement | Document | Window>;

export type EventOption = {
  events?: Array<keyEvent>;
  target?: Target;
};

// 键盘事件 keyCode 别名
const aliasKeyCodeMap: any = {
  esc: 27,
  tab: 9,
  enter: 13, // (13 enter)
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: [8, 46], // ( 8 BackSpace 退格键 ) ( 46 Delete 删除键 )
};

// 键盘事件 key 别名
const aliasKeyMap: any = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  delete: ['Backspace', 'Delete'],
};

// 修饰键
const modifierKey: any = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey,
};

// 返回空对象
const noop = () => {};

/**
 * 判断对象类型
 * @param [obj: any] 参数对象
 * @returns String
 */
function isType(obj: any) {
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1') // 替换成 ( 匹配成功的第一组内容 )，即类型的首字母大写字符串；注意 1. ( $n 表示匹配成功的第n组内容，n是从1开始的自然数 ) 2. 这里只有一个分组
    .toLowerCase();
}

/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: any] 当前键
 * @returns Boolean
 */
function genFilterKey(event: any, keyFilter: any) {
  // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
  if (!event.key) {
    return false;
  }

  const type = isType(keyFilter);
  // 数字类型直接匹配事件的 keyCode
  if (type === 'number') {
    return event.keyCode === keyFilter;
  }
  // 字符串依次判断是否有组合键
  const genArr = keyFilter.split('.'); // 以.将字符串分隔成数组
  let genLen = 0;
  for (const key of genArr) {
    // 组合键
    const genModifier = modifierKey[key]; // 支持 ctrl shift alt meta
    // key 别名
    const aliasKey = aliasKeyMap[key];
    // keyCode 别名
    const aliasKeyCode = aliasKeyCodeMap[key];
    /**
     * 满足以上规则
     * 1. 自定义组合键别名
     * 2. 自定义 key 别名
     * 3. 自定义 keyCode 别名
     * 4. 匹配 key 或 keyCode
     */
    if (
      (genModifier && genModifier(event)) ||
      (aliasKey && isType(aliasKey) === 'array'
        ? aliasKey.includes(event.key)
        : aliasKey === event.key) ||
      (aliasKeyCode && isType(aliasKeyCode) === 'array'
        ? aliasKeyCode.includes(event.keyCode)
        : aliasKeyCode === event.keyCode) ||
      event.key.toUpperCase() === key.toUpperCase()
    ) {
      genLen++;
    }
  }
  return genLen === genArr.length;
}

/**
 * 键盘输入预处理方法
 * @param [keyFilter: any] 当前键
 * @returns () => Boolean
 */
function genKeyFormater(keyFilter: any): KeyPredicate {
  const type = isType(keyFilter);
  if (type === 'function') {
    // keyFilter 是一个函数，直接返回该函数，该函数执行后返回的返回值类型是boolean
    return keyFilter;
  }
  if (type === 'string' || type === 'number') {
    // keyFilter 是 ( number ) | ( string )，分别对应 ( keycode ) 和 ( key别名 ) ，则包装成函数
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter); // genFilterKey 判断按键是否激活
  }
  if (type === 'array') {
    // keyFilter 是一个数组
    return (event: KeyboardEvent) => keyFilter.some((item: any) => genFilterKey(event, item));
  }
  // 不满足以上所有情况
  return keyFilter ? () => true : () => false;
}

const defaultEvents: Array<keyEvent> = ['keydown'];
// export type keyEvent = 'keydown' | 'keyup';

// ------------------------------------------------------------------------------------------------------------------ useKeyPress
// useKeyPress
// - 一个优雅的管理 ( keyup 和 keydown ) 键盘事件的 hook
// - 支持键盘组合键
// - 定义键盘事件的 key 和 keyCode 别名输入
// - 支持返回值是boolean的回调
// 参数
//  - keyFilter: 支持键盘事件中的 ( key和keyCode )，支持 ( 回调方式返回boolean ) 判断，支持 ( 别名 ) 使用
//      - export type KeyFilter = keyType | Array<keyType> | ((event: KeyboardEvent) => boolean);
//      - export type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
//  - eventHandler: 事件监听函数
//  - options: 配置项
// 注意点
// 1
// keydown keyress keyup
//  - 先后顺序：keydown -> keypress -> keyup
//  - 如果用户按下了一个字符键不放，就会重复触发keydown和keypress事件，直到用户松开该键为止
//  - 如果用户按下了一个非字符键不放，就会重复触发keydown事件，直到用户松开该键为止
// 2
// 原生input 和 antd中的Input
//  - 原生input：在react中支持 onKeyDown onKeyUp 键盘按下/释放键盘事件
//  - antdInput：支持 onPressEnter 按下回车的事件
function useKeyPress(
  keyFilter: KeyFilter,
  eventHandler: EventHandler = noop,
  option: EventOption = {},
) {
  const { events = defaultEvents, target } = option;
  // events
  // option.events
  // - const defaultEvents: Array<keyEvent> = ['keydown'];
  // - defaultEvents: 'keydown'

  const callbackRef = useRef(eventHandler);
  callbackRef.current = eventHandler;

  useEffect(() => {
    const callbackHandler = (event) => {
      const genGuard: KeyPredicate = genKeyFormater(keyFilter);
      if (genGuard(event)) {
        return callbackRef.current(event); // 将keyup或者keydown事件的 ( event对象 ) 作为参数传入 ( eventHandler )
      }
    };

    const el = getTargetElement(target, window)!; // 非空target或者非空window

    for (const eventName of events) { // 'keydown' 或者 ‘keyup’
      el.addEventListener(eventName, callbackHandler); // 绑定 keydown 或者 keyup 事件监听
    }
    return () => {
      for (const eventName of events) {
        el.removeEventListener(eventName, callbackHandler); // 清除事件监听
      }
    };
  }, [events, keyFilter, target]);
}

export default useKeyPress;
