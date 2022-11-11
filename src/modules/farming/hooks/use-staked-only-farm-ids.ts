import { useCallback } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getId } from '@shared/helpers';

import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '../helpers';
import { useFarmingListRewardsStore, useFarmingListStore } from './stores';

export const useStakedOnlyFarmIds = () => {
  const farmingListRewardsStore = useFarmingListRewardsStore();
  const farmingListStore = useFarmingListStore();

  const getStakedOnlyFarmIds = useCallback(
    () =>
      farmingListStore.list
        .filter(farmingItem => {
          const balances = farmingListStore.getFarmingItemBalancesModelById(farmingItem.id);

          return balances?.earnBalance?.isGreaterThan(ZERO_AMOUNT_BN);
        })
        .filter(farmingItem => {
          const userInfo = farmingListRewardsStore.findUserInfo(farmingItem.id);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(getId),
    [farmingListRewardsStore, farmingListStore]
  );

  return { getStakedOnlyFarmIds };
};
