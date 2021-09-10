import { useMemo, useState, useCallback } from 'react';

// useMap
// 作用：一个可以管理 Map 类型状态的 Hook


// 1
// review Map
/**
 * - 对象
 *    - 键值对的集合，但键只能是string类型
 * - Map
 *    - ( 值-值 ) 对应的集合
 *    - 是一个种键值对的数据结构，如果是需要 ( 键值对 ) 的数据结构的化，Map比Object更适合
 * - new Map()
 *    - 参数：Map作为构造函数，可以接受一个 ( 数组 ) 作为参数，( 成员是一个个表示键值对的数组 )
 *    - 参数：除了 ( 数组 )，( 任何具有Iterator接口，且每个成员都是一个双元素的数组 ) 的数据结构都可以作为Map的参数 => 参数可以是 ( 数组，Set，Map ) 等数据结构
 * - Map的一些注意点
 *    - 如果对同一个键多次赋值，后面的值将会覆盖前面的值
 *    - 如果读取一个未知的键，将返回undifined
 *    - 注意：
 *      - 只有对 ( 同一个对象的引用 )，Map才会将其视为 ( 同一个键 )
 *        - Map实际上是和内存地址绑定的，只要内存地址不一样，就视为不同的键
 *        - 同名属性碰撞
 *        - 结论：
 *          - 简单类型的值，只要严格相等就视为同一个键
 *          - NaN将视为同一个键
 *          - +0 和 -0 被视为同一个键
 * - Map属性和方法
 *    - map.size
 *    - Map.prototype.set(key, value)
 *    - Map.prototype.get(key)
 *    - Map.prototype.has(key)
 *    - Map.prototype.delete(key)
 *    - Map.prototype.clear()
 *
 *    - Map的遍历顺序就是插入顺序，这些遍历方法返回的并不是数组，而是具有 ( Iterator接口 ) 的数据结构 ( MapIterator )
 *    - Map.prototype.keys()
 *    - Map.prototype.values()
 *    - Map.prototype.entries()
 *    - Map.prototype.forEach()
 *
 *    - Map转为数组最快的方法就是： 展开运算符
 * */


// 2
// review WeakMap
/**
 * - WeakMap结构与Map结构类似，也是用于生成键值对的集合
 * - weak: 是弱的意思
 *
 * - WeakMap 与 Map 的区别
 *    - WeakMap只接受 ( 对象 ) 作为键名
 *    - WeakMap的 ( 键名所指向的对象，注意是 - 键名 )，( 不计入垃圾回收机制 )
 *      -> WeckMap的键名所引用的对象都是 ( 弱引用 )
 *      -> 用来解决对象引用的内存占用，防止内存泄露
 *      -> 一定要注意 ( 弱引用 ) 指的是 ( WeakMap 的键名对象，而不是键值 )
 *
 * - WeakMap 的应用
 *    - 数据缓存
 *    - 私有属性
 *    - 在DOM对象上保存相关数组
 * */

/* 对比1
  const wm = new WeakMap();
  let key = {};
  let obj = {foo: 1};
  wm.set(key, obj);
  obj = null; // ------------------- 修改了value
  wm.get(key) // ------------------- {foo: 1}，这里不会值null
*/

/* 对比2
  const wm = new WeakMap();
  let key = {};
  let obj = {foo: 1};
  wm.set(key, obj);
  key = { name: 'woow_wu7' }; // ---- 修改了key
  wm.get(key) // -------------------- undefined
*/


function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {

  const initialMap = useMemo<Map<K, T>>(
    () => (initialValue === undefined ? new Map() : new Map(initialValue)) as Map<K, T>,
    [],
  );

  const [map, setMap] = useState(initialMap);

  const stableActions = useMemo( // 缓存一个对象, stable 是固定的意思
    () => ({
      set: (key: K, entry: T) => { // ------------------------- set
        setMap((prev) => {
          const temp = new Map(prev);
          temp.set(key, entry);
          return temp;
        });
      },
      setAll: (newMap: Iterable<readonly [K, T]>) => { // ----- setAll
        setMap(new Map(newMap));
      },
      remove: (key: K) => { // -------------------------------- remove
        setMap((prev) => {
          const temp = new Map(prev);
          temp.delete(key);
          return temp;
        });
      },
      reset: () => setMap(initialMap), // ---------------------- reset
    }),
    [setMap, initialMap],
  );

  const utils = {
    get: useCallback((key) => map.get(key), [map]), // ---------- get -> Map.prototpye.get(key) 缓存函数
    ...stableActions,
  };

  return [map, utils] as const;
  // 1
  // value as const 表示const断言
  // - value是数组，则表示该数组只读，不能修改，添加，删除等操作
}

export default useMap;
