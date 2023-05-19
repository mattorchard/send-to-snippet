import { useCallback, useLayoutEffect, useRef } from "preact/hooks";

// Use with caution
export const useLiveCallback = <ArgType extends unknown[], ReturnType>(
  callback: (...args: ArgType) => ReturnType
) => {
  const ref = useRef(callback);
  useLayoutEffect(() => {
    ref.current = callback;
  });
  return useCallback((...args: ArgType) => ref.current(...args), []);
};
