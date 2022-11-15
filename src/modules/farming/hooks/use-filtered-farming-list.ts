import { useAuthStore } from '@shared/hooks';

import { filterAndOrderFarmings } from '../helpers';
import { farmingListCommonDataHelper } from '../pages/list/farming-list-common-data.helper';
import { useFarmingFilterStore, useFarmingListStore } from './stores';

export const useFilteredFarmingList = () => {
  const { accountPkh } = useAuthStore();
  const { activeOnly, stakedOnly, sortField, sortDirection, search, tokenId } = useFarmingFilterStore();
  const farmingListStore = useFarmingListStore();

  const farmings = filterAndOrderFarmings(farmingListStore.farmingItemsWithBalances, {
    activeOnly,
    stakedOnly,
    sortField,
    sortDirection,
    search,
    tokenId,
    accountPkh
  }).map(item => farmingListCommonDataHelper(item, accountPkh));

  return { farmings };
};
