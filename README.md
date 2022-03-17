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
- [x] useUnmountRef -> 获取当前组件 ( 是否被卸载 ) 的hook
- [x] useClickAway -> 管理目标元素外的点击事件
- [x] useScroll -> 获取元素的 滚动 状态的hook
- [x] useKeyPress -> 一个优雅的管理 keyup 和 keydown 键盘事件的 Hook，支持 ( keyFilter支持键盘组合键，key，keycode，别名，返回值是boolean的回调 )
- [x] useInViewport -> 一个用于判断dom元素是否在可视化范围之内的hook
- [x] useEventTarget -> 对表单控件中的 onChange 和 value 的封装，具有 reset transform 等功能
- [x] useHover -> 利用 useEventListener 和 useBoolean(useToggle) 实现，表示鼠标是否悬停在DOM元素上
- [x] useSize



### (二) 其他源码分析

#### (1) redux 和 react-redux 源码分析 [redux^4.0.5]
- [redux源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/REDUX)
- [redux源码分析-我的掘金博客](https://juejin.cn/post/6844904137952329742)

#### (2) 手写 webpack Compiler 源码 [webpack^4.42.0]
- [手写Compiler源码-仓库](https://github.com/woow-wu7/7-compiler)
- [手写Compiler源码-我的掘金文章](https://juejin.cn/post/6844903973002936327)

#### (3) axios 源码分析 [axios^0.20.0]
- [axios源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/AXIOS)
- [axios源码分析-我的掘金文章](https://juejin.cn/post/6844904147532120072)
- [cancel取消请求的原理，interceptor拦截器的原理 - 两个重点掌握](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/pages/admin-system/interview-cancel/index.tsx)

#### (4) vue 源码分析 [vue^2.6.12]
- [vue源码分析-仓库](https://github.com/woow-wu7/7-react-admin-ts/tree/master/src/SOURCE-CODE-ANALYSIS/VUE)
- [vue源码分析-新建仓库](https://github.com/woow-wu7/7-vue2-source-code-analysis)
- [vue源码分析-我的掘金文章](https://juejin.cn/post/6844904181094957069)

#### (5) vuex 源码分析 [v2.6.10]
- [vuex源码分析-我的掘金文章](https://juejin.cn/post/6844904166293241863)

#### (6) react 源码分析 [react^17.0.3]
- [react源码分析-仓库](https://github.com/woow-wu7/7-react-source-code-analysis)
- [react源码分析-我的掘金文章](https://juejin.cn/post/6993980489463758855)
- [js实现单向链表 - 源码](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/manual/linked-list.js)
- [手写hook调度-useState实现 - 源码仓库](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/manual/hooks-manual.js)
- [手写hook调度-useState实现 - 思维导图](https://github.com/woow-wu7/7-react-source-code-analysis/blob/main/src/images/hook-useState.png)

#### (7) a-hooks2.0 源码分析 [a-hooks^2.10.9]
- [a-hooks源码分析 - 仓库](https://github.com/woow-wu7/7-a-hooks-source-code-analysis)

#### (8) a-hooks3.0 源码分析 [a-hooks^2.10.9]
- [a-hooks源码分析 - 仓库](https://github.com/woow-wu7/7-a-hooks3.0-source-code-analysis)

#### (9) koa 源码分析 [koa^2.13.1]
- [koa源码分析 - 仓库](https://github.com/woow-wu7/7-koa-source-code-analysis)
- [koa源码调试 - 仓库](https://github.com/woow-wu7/7-koa-source-code-analysis)
- 注意分析：( axios拦截器 + redux中间件 + koa中间件 ) 三者的相同点和区别

#### (10) badJs-report 源码分析
- [badJs-report源码分析-仓库](https://github.com/woow-wu7/7-badjs-report-analysis)

#### (11) element-ui 源码分析
- [element-ui 源码分析-仓库](https://github.com/woow-wu7/8-element-source-code-analysis)


