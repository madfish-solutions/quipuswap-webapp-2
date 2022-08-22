import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useNewLiquidityViewModel = () => {
  const rootStore = useRootStore();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Nullable<Error>>(null);

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.newLiquidityListStore)) {
          await rootStore.createNewLiquidityListStore();
        }

        if (isNull(rootStore.newLiquidityItemStore)) {
          await rootStore.createNewLiquidityItemStore();
        }
        setIsInitialized(true);
      } catch (_error) {
        setError(_error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialized, error };
};
