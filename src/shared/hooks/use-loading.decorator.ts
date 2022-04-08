import { useState } from 'react';

import { useToasts } from './use-toasts';

export const useLoadingDecorator = (func: () => Promise<void>) => {
  const { showErrorToast } = useToasts();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoratorFunction = async () => {
    setIsLoading(true);
    try {
      return await func();
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const result: [boolean, () => Promise<void>] = [isLoading, decoratorFunction];

  return result;
};
