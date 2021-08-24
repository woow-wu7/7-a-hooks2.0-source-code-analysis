import useBoolean from '../useBoolean';
import useEventListener from '../useEventListener';
import { BasicTarget } from '../utils/dom';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
}

export default (target: BasicTarget, options?: Options): boolean => {
  const { onEnter, onLeave } = options || {};

<<<<<<< HEAD
  const [state, { setTrue, setFalse }] = useBoolean(false); // 1. 利用 useToggle 实现

  useEventListener(
    // 2. 利用 useEventListener
=======
  const [state, { setTrue, setFalse }] = useBoolean(false);

  useEventListener(
>>>>>>> 3dc5e0de57222972a0992179e086f87c5592a0d1
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
