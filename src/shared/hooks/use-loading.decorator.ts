import { useCallback, useState } from 'react';

import { Undefined } from '@shared/types';

import { useToasts } from './use-toasts';

export const useLoadingDecorator = <T>(func: () => Promise<T>): [boolean, () => Promise<Undefined<T>>] => {
  const { showErrorToast } = useToasts();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoratorFunction = useCallback<() => Promise<Undefined<T>>>(async () => {
    setIsLoading(true);
    try {
      return await func();
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [func, showErrorToast]);

  return [isLoading, decoratorFunction];
};
