import { useCallback } from 'react';

import { fullRewardIsAvailable } from '../helpers';
import { useFarmingListStore } from './stores';

export const useFullRewardClaimableFarmsIds = () => {
  const farmingListStore = useFarmingListStore();

  const getFullRewardClaimableFarmsIds = useCallback(
    () => farmingListStore.farmingItemsWithBalances.filter(item => fullRewardIsAvailable(item)),
    [farmingListStore]
  );

  return { getFullRewardClaimableFarmsIds };
};
