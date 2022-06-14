import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useStableFarmRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const [routerError, setRouterError] = useState<Nullable<Error>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.stableFarmListStore)) {
          await rootStore.createStableFarmListStore();
        }
        setIsInitialazied(true);
      } catch (error) {
        setRouterError(error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialazied, error: routerError };
};