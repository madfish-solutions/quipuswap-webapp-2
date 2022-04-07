import { useState } from 'react';

import { useToasts } from '@shared/hooks';

export const useLoadingDecorator = () => {
  const { showErrorToast } = useToasts();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoratorFunction = async (func: () => Promise<void>) => {
    setIsLoading(true);
    try {
      return await func();
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    decoratorFunction
  };
};
