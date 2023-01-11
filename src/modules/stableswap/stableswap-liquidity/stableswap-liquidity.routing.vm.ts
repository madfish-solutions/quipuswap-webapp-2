import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const useStableswapLiquidityRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const [error, setError] = useState<Nullable<Error>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.stableswapItemStore) || isNull(rootStore.stableswapItemFormStore)) {
          await rootStore.createStableswapItemStore();
          await rootStore.createStableswapItemFormStore();
        }
        setIsInitialazied(true);
      } catch (_error) {
        setError(_error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialazied, error };
};
