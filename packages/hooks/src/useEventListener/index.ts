import { useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from '../utils/dom';

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void;
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void;
function useEventListener(eventName: string, handler: Function, options: Options): void;


// useEventListener
// ------------------------------------------------------------------------------------------------------------ useEventListener
function useEventListener(eventName: string, handler: Function, options: Options = {}) {
  const handlerRef = useRef<Function>();
  handlerRef.current = handler;

  useEffect(() => {
    const targetElement = getTargetElement(options.target, window)!;
    if (!targetElement.addEventListener) {
      return;
    }

    const eventListener = (
      event: Event,
    ): EventListenerOrEventListenerObject | AddEventListenerOptions => {
      return handlerRef.current && handlerRef.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, {
      capture: options.capture, // 是否在捕获阶段触发
      once: options.once, // 是否只触发一次
      passive: options.passive, // boolean，表示监听函数不会调用 preventDefault 方法；passive是被动的，消极的意思
    });

    return () => {
      targetElement.removeEventListener(eventName, eventListener, { // 删除监听函数
        capture: options.capture,
      });
    };
  }, [eventName, options.target, options.capture, options.once, options.passive]);
}

export default useEventListener;
