import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useStableDividendsRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const [routerError, setRouterError] = useState<Nullable<Error>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.stableDividendsListStore) || isNull(rootStore.stableDividendsFilterStore)) {
          await rootStore.createStableDividendsListStore();
          await rootStore.createStableDividendsFilterStore();
        }
        if (isNull(rootStore.stableDividendsItemStore)) {
          await rootStore.createStableDividendsItemStore();
        }

        setIsInitialazied(true);
      } catch (error) {
        setRouterError(error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialazied, error: routerError };
};
