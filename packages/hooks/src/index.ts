import useRequest, { UseRequestProvider } from '@ahooksjs/use-request';
import useControllableValue from './useControllableValue';
import useDynamicList from './useDynamicList';
import useEventEmitter from './useEventEmitter';
import useVirtualList from './useVirtualList';
import { configResponsive, useResponsive } from './useResponsive';
import useSize from './useSize';
import useLocalStorageState from './useLocalStorageState'; // useLocalStorageState
import useSessionStorageState from './useSessionStorageState';
import useUpdateEffect from './useUpdateEffect'; // useUpdateEffect
import useUpdateLayoutEffect from './useUpdateLayoutEffect';
import useBoolean from './useBoolean';
import useToggle from './useToggle'; // useToggle
import useDocumentVisibility from './useDocumentVisibility';
import useSelections from './useSelections';
import useThrottle from './useThrottle'; // useThrottle
import useThrottleFn from './useThrottleFn';
import useThrottleEffect from './useThrottleEffect';
import useDebounce from './useDebounce';
import useDebounceFn from './useDebounceFn';
import usePrevious from './usePrevious';
import useMouse from './useMouse';
import useScroll from './useScroll';
import useClickAway from './useClickAway';
import useFullscreen from './useFullscreen'; // useFullscreen
import useInViewport from './useInViewport';
import useKeyPress from './useKeyPress';
import useEventListener from './useEventListener'; // useEventListener
import useHover from './useHover';
import useUnmount from './useUnmount';
import useAntdTable from './useAntdTable';
import useFusionTable from './useFusionTable';
import useSet from './useSet'; // useSet 和 useMap 类似
import usePersistFn from './usePersistFn';
import useMap from './useMap'; // useMap
import useCreation from './useCreation'; // useCreation 是 useMemo 或者 useRef 的替代品，因为useMemo不能保证memo的值一定不会被重计算
import useDrop from './useDrop';
import useDrag from './useDrag';
import useMount from './useMount';
import useTextSelection from './useTextSelection';
import useCounter from './useCounter';
import useUpdate from './useUpdate'; // useUpdate 强制组件重新渲染
import useEventTarget from './useEventTarget';
import useHistoryTravel from './useHistoryTravel';
import useDebounceEffect from './useDebounceEffect';
import useCookieState from './useCookieState';
import useSetState from './useSetState'; // useSetState
import useInterval from './useInterval';
import useWhyDidYouUpdate from './useWhyDidYouUpdate';
import useTitle from './useTitle'; // useTitle 设置页面标题
import useNetwork from './useNetwork';
import useTimeout from './useTimeout'; // useTimeout
import useReactive from './useReactive';
import useFavicon from './useFavicon';
import useCountDown from './useCountDown';
import useWebSocket from './useWebSocket';
import useLockFn from './useLockFn'; // useLockFn，用于给一个异步函数增加 ( 竞态锁 )，防止并发执行
import useTrackedEffect from './useTrackedEffect';
import useUnmountedRef from './useUnmountedRef';
import useExternal from './useExternal';
import useSafeState from './useSafeState';

const useControlledValue: typeof useControllableValue = function (...args: any) {
  console.warn(
    'useControlledValue is deprecated and will be removed in the next major version. Please use useControllableValue instead.',
  );
  return useControllableValue(...args);
};

export {
  useControlledValue,
  useControllableValue,
  useDynamicList,
  useVirtualList,
  useResponsive,
  useEventEmitter,
  useLocalStorageState, // useLocalStorageState
  useSessionStorageState,
  useSize,
  configResponsive,
  useUpdateEffect,
  useUpdateLayoutEffect,
  useBoolean,
  useToggle, // useToggle
  useDocumentVisibility,
  useSelections,
  useThrottle,
  useThrottleFn,
  useThrottleEffect,
  useDebounce,
  useDebounceFn,
  useDebounceEffect,
  usePrevious,
  useMouse,
  useScroll,
  useClickAway,
  useFullscreen,
  useInViewport,
  useKeyPress,
  useEventListener,
  useHover,
  useRequest,
  UseRequestProvider,
  useAntdTable,
  useUnmount,
  useSet,
  usePersistFn,
  useMap,
  useCreation,
  useDrag,
  useDrop,
  useMount,
  useCounter,
  useUpdate,
  useTextSelection,
  useEventTarget,
  useHistoryTravel,
  useFusionTable,
  useCookieState,
  useSetState,
  useInterval,
  useWhyDidYouUpdate,
  useTitle, // useTitle 设置页面标题
  useNetwork,
  useTimeout,
  useReactive,
  useFavicon,
  useCountDown,
  useTrackedEffect,
  useWebSocket,
  useLockFn,
  useUnmountedRef,
  useExternal,
  useSafeState,
};
