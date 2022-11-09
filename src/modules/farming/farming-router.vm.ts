import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useFarmingRouterViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.farmingFilterStore) ||
          isNull(rootStore.farmingItemStore) ||
          isNull(rootStore.farmingListStatsStore) ||
          isNull(rootStore.farmingListRewardsStore) ||
          isNull(rootStore.farmingListStore) ||
          isNull(rootStore.coinflipStore) ||
          isNull(rootStore.harvestAndRollStore) ||
          isNull(rootStore.farmingYouvesItemStore)
        ) {
          await Promise.all([
            await rootStore.createFarmingFilterStore(),
            await rootStore.createFarmingListStatsStore(),
            await rootStore.createFarmingListRewardsStore(),
            await rootStore.createFarmingListStore(),
            await rootStore.createFarmingItemStore(),
            await rootStore.createCoinflipStore(),
            await rootStore.createHarvestAndRollStore(),
            await rootStore.createFarmingYouvesItemStore()
          ]);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  return { isInitialized, error };
};
