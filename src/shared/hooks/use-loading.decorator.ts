import { useCallback, useState } from 'react';

import { useToasts } from './use-toasts';

export const useLoadingDecorator = <T>(func: () => Promise<T>): [boolean, () => Promise<void>] => {
  const { showErrorToast } = useToasts();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoratorFunction = useCallback<() => Promise<void>>(async () => {
    setIsLoading(true);
    try {
      await func();
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [func, showErrorToast]);

  return [isLoading, decoratorFunction];
};
