import { useCallback } from 'react';

import { getId } from '@shared/helpers';

import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime, isStakedFarming } from '../helpers';
import { useFarmingListRewardsStore, useFarmingListStore } from './stores';

export const useStakedOnlyFarmIds = () => {
  const farmingListRewardsStore = useFarmingListRewardsStore();
  const farmingListStore = useFarmingListStore();
  const { list } = farmingListStore;

  const getStakedOnlyFarmIds = useCallback(
    () =>
      list
        .filter(isStakedFarming)
        .filter(farmingItem => {
          const userInfo = farmingListRewardsStore.findUserInfo(farmingItem.id);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(getId),
    [farmingListRewardsStore, list]
  );

  return { getStakedOnlyFarmIds };
};
