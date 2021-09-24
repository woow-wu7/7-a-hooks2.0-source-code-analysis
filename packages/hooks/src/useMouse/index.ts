import { useState } from 'react';
import useEventListener from '../useEventListener';

export interface CursorState {
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
}

const initState: CursorState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
};

// useMouse
export default () => {
  const [state, setState] = useState(initState);

  useEventListener(
    'mousemove',
    (event: MouseEvent) => {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
      setState({ screenX, screenY, clientX, clientY, pageX, pageY });
      // screenX 距离 ( 显示器 ) 左侧的距离 - 显示器
      // clientX 距离 ( 当前视窗 ) 左侧的距离 - 视窗
      // pageX 距离 ( 完整页面 ) 左侧的距离 - 包括视窗之外
    },
    {
      target: document,
    },
  );

  return state;
};
