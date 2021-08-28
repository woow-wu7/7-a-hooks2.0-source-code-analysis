/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useContext } from 'react';
import {
  BaseOptions,
  BasePaginatedOptions,
  BaseResult,
  CombineService,
  LoadMoreFormatReturn,
  LoadMoreOptions,
  LoadMoreOptionsWithFormat,
  LoadMoreParams,
  LoadMoreResult,
  OptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedOptionsWithFormat,
  PaginatedParams,
  PaginatedResult,
} from './types';
import useAsync from './useAsync';
import useLoadMore from './useLoadMore';
import usePaginated from './usePaginated';
import ConfigContext from './configContext';

function useRequest<R = any, P extends any[] = any, U = any, UU extends U = any>(
  service: CombineService<R, P>,
  options: OptionsWithFormat<R, P, U, UU>,
): BaseResult<U, P>;
function useRequest<R = any, P extends any[] = any>(
  service: CombineService<R, P>,
  options?: BaseOptions<R, P>,
): BaseResult<R, P>;

function useRequest<R extends LoadMoreFormatReturn, RR>(
  service: CombineService<RR, LoadMoreParams<R>>,
  options: LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R>;
function useRequest<R extends LoadMoreFormatReturn, RR extends R>(
  service: CombineService<R, LoadMoreParams<R>>,
  options: LoadMoreOptions<RR>,
): LoadMoreResult<R>;

function useRequest<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>,
  options: PaginatedOptionsWithFormat<R, Item, U>,
): PaginatedResult<Item>;
function useRequest<R = any, Item = any, U extends Item = any>(
  service: CombineService<PaginatedFormatReturn<Item>, PaginatedParams>,
  options: BasePaginatedOptions<U>,
): PaginatedResult<Item>;

function useRequest(service: any, options: any = {}) {
  const contextConfig = useContext(ConfigContext);
  // const ConfigContext = React.createContext<Config>({});
  // ConfigContext.displayName = 'UseRequestConfigContext';

  const finalOptions = { ...contextConfig, ...options };
  // 合并 options

  const { paginated, loadMore, requestMethod } = finalOptions;

  const paginatedRef = useRef(paginated);
  const loadMoreRef = useRef(loadMore);

  if (paginatedRef.current !== paginated) {
    throw Error('You should not modify the paginated of options');
  }

  if (loadMoreRef.current !== loadMore) {
    throw Error('You should not modify the loadMore of options');
  }

  paginatedRef.current = paginated;
  loadMoreRef.current = loadMore;

  // @ts-ignore
  const fetchProxy = (...args: any[]) =>
    // @ts-ignore
    fetch(...args).then((res: Response) => {
      if (res.ok) {
        return res.json();
        // resposne 是 Response对象
        // 1
        // json数据 --- response.json()
        // 文本 ------- response.text() 是一个字符串，比如请求的静态资源是 md 文件等
        // 图片 ------- rsponse.blob()
        // 表单 ------- response.formData()
        // 2
        // resposne对象中包含: header status statusText 等属性
        // 3
        // 注意点
        // - 1. 当收到一个错误状态码时，fetch返回的promise对象的状态仍然是 resolved，但是 ( response.ok = false )
        // - 2. 仅当网络故障，或请求被阻止时，才会标记为 rejected
      }
      throw new Error(res.statusText);
    });
  // fetch 和  ajax 的区别
  // 1. fetch更加简洁和语义化
  // 2. 基于promise标准，支持 async await 语法
  // 3. fetch返回的是一个promise对象

  // 4. 跨域cors获取cookie
  // - 1. ajax  => xhr.withCredentials = true
  // - 2. fetch => option.credentials = 'include' | 'same-origin' | 'omit'
  //      - 跨域 'include'
  //      - 只想在请求URL与调用脚本位于同一起源处时发送凭据 => 'same-origin'
  //      - 不包含凭据 => 'omit'

  const finalRequestMethod = requestMethod || fetchProxy; // 降级处理

  let promiseService: () => Promise<any>;

  // serice
  // - 包含 string object function 等情况
  switch (typeof service) {
    case 'string':
      promiseService = () => finalRequestMethod(service); // string类型，将作为fetch的第一个参数传入即当作url传入
      break;
    case 'object':
      const { url, ...rest } = service; // object类型，结构
      promiseService = () => (requestMethod ? requestMethod(service) : fetchProxy(url, rest));
      break;
    default:
      // function
      promiseService = (...args: any[]) =>
        new Promise((resolve, reject) => {
          const s = service(...args); // 调用 function
          let fn = s;
          if (!s.then) {
            // 不是一个promise
            switch (typeof s) {
              case 'string':
                fn = finalRequestMethod(s);
                break;
              case 'object':
                const { url, ...rest } = s;
                fn = requestMethod ? requestMethod(s) : fetchProxy(url, rest);
                break;
            }
          }
          fn.then(resolve).catch(reject);
        });
  }

  if (loadMore) {
    return useLoadMore(promiseService, finalOptions);
  }
  if (paginated) {
    return usePaginated(promiseService, finalOptions);
  }
  return useAsync(promiseService, finalOptions);
}

const UseRequestProvider = ConfigContext.Provider;

// UseAPIProvider 已经废弃，此处为了兼容 umijs 插件 plugin-request
const UseAPIProvider = UseRequestProvider;

export { useAsync, usePaginated, useLoadMore, UseRequestProvider, UseAPIProvider };

export default useRequest;
