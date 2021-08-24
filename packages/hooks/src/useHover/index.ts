import useBoolean from '../useBoolean';
import useEventListener from '../useEventListener';
import { BasicTarget } from '../utils/dom';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
}

export default (target: BasicTarget, options?: Options): boolean => {
  const { onEnter, onLeave } = options || {};

  const [state, { setTrue, setFalse }] = useBoolean(false); // 1. 利用 useToggle 实现

  useEventListener(
    // 2. 利用 useEventListener
    'mouseenter',
    () => {
      onEnter && onEnter();
      setTrue();
    },
    {
      target,
    },
  );

  useEventListener(
    'mouseleave',
    () => {
      onLeave && onLeave();
      setFalse();
    },
    {
      target,
    },
  );

  return state;
};
