import { useCallback } from 'react';

import { ZERO_AMOUNT } from '@config/constants';

import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '../helpers';
import { useFarmingListStore } from './stores/use-farming-list-store';

export const useStakedOnlyFarmIds = () => {
  const farmingListStore = useFarmingListStore();

  const getStakedOnlyFarmIds = useCallback(
    () =>
      farmingListStore.listList
        .filter(({ id }) =>
          farmingListStore.getFarmingItemBalancesModelById(id.toFixed())?.earnBalance?.gt(ZERO_AMOUNT)
        )
        .filter(farmingItem => {
          const userInfo = farmingListStore.findUserInfo(farmingItem.id.toFixed());
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(({ id }) => id),
    [farmingListStore]
  );

  return { getStakedOnlyFarmIds };
};