import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useStableswapPageViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.stableswapListStore) ||
          isNull(rootStore.stableswapItemStore) ||
          isNull(rootStore.stableswapFilterStore)
        ) {
          await rootStore.createStableswapListStore();
          await rootStore.createStableswapItemStore();
          await rootStore.createStableswapFilterStore();
        }
      } finally {
        setIsInitialazied(true);
      }
    })();
  }, [rootStore]);

  return { isInitialazied };
};
