import { useCallback } from 'react';

import { ZERO_AMOUNT } from '@config/constants';

import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '../helpers';
import { useFarmingListStore, useFarmingListRewardsStore } from './stores';

export const useStakedOnlyFarmIds = () => {
  const farmingListRewardsStore = useFarmingListRewardsStore();
  const farmingListStore = useFarmingListStore();
  const { list } = farmingListStore;

  const getStakedOnlyFarmIds = useCallback(
    () =>
      list
        .filter(({ id }) => farmingListStore.getFarmingItemBalancesModelById(id)?.earnBalance?.gt(ZERO_AMOUNT))
        .filter(farmingItem => {
          const userInfo = farmingListRewardsStore.findUserInfo(farmingItem.id);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(({ id }) => id),
    [farmingListRewardsStore, farmingListStore, list]
  );

  return { getStakedOnlyFarmIds };
};
