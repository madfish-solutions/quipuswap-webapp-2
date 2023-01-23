import { useCallback } from 'react';

import { shouldHarvestInBatch } from '../helpers';
import { useFarmingListStore } from './stores';

export const useHarvestReadyFarmsIds = () => {
  const farmingListStore = useFarmingListStore();

  const getHarvestReadyFarmsIds = useCallback(
    () => farmingListStore.farmingItemsWithBalances.filter(shouldHarvestInBatch),
    [farmingListStore]
  );

  return { getHarvestReadyFarmsIds };
};
