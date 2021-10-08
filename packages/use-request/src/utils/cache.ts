type Timer = ReturnType<typeof setTimeout>;

export type CachedKeyType = string | number;
export type cachedData = { data: any; timer: Timer | undefined; startTime: number };

// cache
// - 是一个map结构
const cache = new Map<CachedKeyType, cachedData>();


// setCache
const setCache = (key: CachedKeyType, cacheTime: number, data: any) => {
  const currentCache = cache.get(key);
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer);
    // 存在 timer 清除掉 timer
    // 清掉timer后，下面又会有新的timer被赋值
  }

  let timer: Timer | undefined = undefined;

  if (cacheTime > -1) {
    // 数据在不活跃 cacheTime 后，删除掉
    timer = setTimeout(() => {
      cache.delete(key); // 设置缓存的时间到点后，删除掉缓存的数据
    }, cacheTime);
  }

  cache.set(key, { // 存入数据
    data,
    timer,
    startTime: new Date().getTime(),
    // startTime
    // - getTime()：返回实例距离1970年1月1日00:00:00的毫秒数，等同于valueOf方法
  });
};


// getCache
const getCache = (key: CachedKeyType) => {
  const currentCache = cache.get(key); // currentCache 中包含 ( data, timer, startTime )
  return {
    data: currentCache?.data,
    startTime: currentCache?.startTime,
  };
};

export { getCache, setCache };
