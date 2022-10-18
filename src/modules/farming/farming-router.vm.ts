import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useFarmingRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.farmingFilterStore) ||
          isNull(rootStore.farmingItemStore) ||
          isNull(rootStore.farmingListStore)
        ) {
          await rootStore.createFarmingFilterStore();
          await rootStore.createFarmingListStore();
          await rootStore.createFarmingItemStore();
          await rootStore.createCoinflipStore();
          await rootStore.createHarvestAndRollStore();
        }
      } finally {
        setIsInitialazied(true);
      }
    })();
  }, [rootStore]);

  return { isInitialazied };
};
