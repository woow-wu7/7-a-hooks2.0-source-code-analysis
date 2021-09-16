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
- [x] useTitle useUnmount
- [x] useLockFn -> 用于给一个 ( 异步函数 ) 添加 ( 竞态锁 )，防止 ( 并发执行 )
- [x] useCreation -> 是 useMemo 或 useRef 的替代品
