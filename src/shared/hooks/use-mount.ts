import { useCallback, useEffect, useMemo, useRef } from 'react';

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

  const isNextStepsRelevant = useMemo(
    () =>
      new Proxy(
        { value: true },
        {
          get(target: { value: boolean }, prop: string) {
            if (prop === 'value') {
              return checkIfLocationChanged();
            }
          }
        }
      ),
    [checkIfLocationChanged]
  );

  return { isNextStepsRelevant };
};
