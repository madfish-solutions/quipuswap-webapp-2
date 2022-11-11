import { useCallback, useEffect, useRef } from 'react';

const createProxy = (checker: () => boolean) =>
  new Proxy(
    { value: true },
    {
      get(target: { value: boolean }, prop: string) {
        if (prop === 'value') {
          return checker();
        }
      }
    }
  );

export const useMount = () => {
  const location = useRef(window.location.href);
  const isUnmounted = useRef(true);

  useEffect(() => {
    isUnmounted.current = false;

    return () => {
      isUnmounted.current = true;
    };
  });

  const checkIfLocationChanged = useCallback(
    () => !isUnmounted.current && location.current === window.location.href,
    []
  );

  const isNextStepsRelevant = createProxy(checkIfLocationChanged);

  return { isNextStepsRelevant };
};
