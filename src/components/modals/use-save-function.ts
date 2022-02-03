import { useCallback, useEffect, useRef, useState } from 'react';

export const useSaveFunction = <Type>(save: (values: Type) => Promise<void>, values: Type, debounce: number) => {
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef<NodeJS.Timeout>();
  const promise = useRef<Promise<void>>();

  const saveFunc = useCallback(async () => {
    if (promise) {
      // TODO: Remove this fucking shit
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await promise;
    }
    setVal(values);
    setSubm(true);
    promise.current = save(values);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await promise;
    setSubm(false);
  }, [save, values]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values, debounce, saveFunc]);
};
