# 7-a-hooks-source-code-analysis

### 任务清单 - 完成度

- [x] useUpdate -> 强制组件重新渲染
- [x] useUpdateEffect -> 用法上和useEffect完全保持一致，只是 ( useUpdateEffect ) 忽略了 ( 首次渲染 )，并且 ( 只在依赖项更新时运行 )
- [x] useLocalStorageState
- [x] useToggle useBoolean
- [x] useTimeout
- [x] useFullscreen
- [x] useResponsive configResponsive
- [x] useMap
- [x] useSetState -> 类似于class中的this.setState()
- [x] useTitle
- [x] useLockFn -> 用于给一个 ( 异步函数 ) 添加 ( 竞态锁 )，防止 ( 并发执行 )
- [x] useCreation -> 是 useMemo 或 useRef 的替代品
- [x] useTextSelection -> 实时获取用户当前选取的文本内容及位置
- [x] useEventListener -> 优雅的使用 addEventListener
- [x] useMouse - 依赖 useEventListener -> 一个跟踪鼠标信息的hook
- [x] useFavicon -> 设置和切换页面的favicon
- [x] useInterval -> 一个用来处理 setInterval 的hook，具有设置 immediate，delay 的加强功能
- [x] usePersistFn -> 持久化function的hooks，注意和useCallback的区别
- [x] useMount -> 只在mount阶段执行的hook，注意只在mount阶段执行一次
- [x] useUnmount -> 只在组件 unmount 时执行的hook，利用 useEffect的参数函数的返回函数实现
- [x] useUnmountRef -> 获取当前组件 ( 是否被卸载 ) 的hook
- [x] useClickAway -> 管理目标元素外的点击事件
