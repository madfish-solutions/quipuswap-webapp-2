import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useStableswapLiquidityRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const [error, setError] = useState<Nullable<Error>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.stableswapListStore) ||
          isNull(rootStore.stableswapItemStore) ||
          isNull(rootStore.stableswapItemFormStore) ||
          isNull(rootStore.stableswapFilterStore)
        ) {
          await rootStore.createStableswapListStore();
          await rootStore.createStableswapItemStore();
          await rootStore.createStableswapItemFormStore();
          await rootStore.createStableswapFilterStore();
        }
        setIsInitialazied(true);
      } catch (_error) {
        setError(_error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialazied, error };
};
