import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useFarmingRouterViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.farmingFilterStore) ||
          isNull(rootStore.farmingItemStore) ||
          isNull(rootStore.farmingListStore) ||
          isNull(rootStore.farmingListCommonStore) ||
          isNull(rootStore.coinflipStore) ||
          isNull(rootStore.harvestAndRollStore) ||
          isNull(rootStore.farmingYouvesItemStore)
        ) {
          await rootStore.createFarmingFilterStore();
          await rootStore.createFarmingListStore();
          await rootStore.createFarmingListCommonStore();
          await rootStore.createFarmingItemStore();
          await rootStore.createCoinflipStore();
          await rootStore.createHarvestAndRollStore();
          await rootStore.createFarmingYouvesItemStore();
        }
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  return { isInitialized };
};
