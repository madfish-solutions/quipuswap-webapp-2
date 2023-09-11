import { useCallback } from 'react';

import { useFarmingListStore } from './stores';
import { shouldHarvestInBatch } from '../helpers';

export const useHarvestReadyFarmsIds = () => {
  const farmingListStore = useFarmingListStore();

  const getHarvestReadyFarmsIds = useCallback(
    () => farmingListStore.farmingItemsWithBalances.filter(shouldHarvestInBatch),
    [farmingListStore]
  );

  return { getHarvestReadyFarmsIds };
};
