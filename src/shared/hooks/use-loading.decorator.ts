import { useCallback, useState } from 'react';

import { useToasts } from '@shared/utils';

export const useLoadingDecorator = <T>(func: () => Promise<T>): [boolean, () => Promise<T>] => {
  const { showErrorToast } = useToasts();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoratorFunction = useCallback<() => Promise<T>>(async () => {
    setIsLoading(true);
    try {
      const result = await func();
      setIsLoading(false);

      return result;
    } catch (error) {
      showErrorToast(error as Error);
      setIsLoading(false);

      return Promise.reject(error);
    }
  }, [func, showErrorToast]);

  return [isLoading, decoratorFunction];
};
